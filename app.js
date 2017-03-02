'use strict'

const Promise = require('bluebird')
const _ = require('lodash')
const schedule = require('node-schedule')

const { getUpdates, sendMessage } = require('./lib/telegram')

const lastMessage = {}

function getRecentChats(chats) {
  return _.chain(chats)
    .filter(({ chatId, date }) => !lastMessage[chatId] || lastMessage[chatId] < date)
    .each(({ chatId, date }) => {
      lastMessage[chatId] = date
    })
    .value()
}

function answerToMessages(text) {
  return getUpdates({ limit: 100 })
    .then(({ ok, result }) => {
      if (!ok) return Promise.reject()
      const chats = _.chain(result)
        .map(({ message }) => ({
          chatId: message.chat.id,
          firstName: message.chat.first_name,
          lastName: message.chat.last_name,
          date: message.date
        }))
        .orderBy('date', 'desc')
        .uniqBy(({ chatId }) => chatId)
        .value()
      const recentChats = getRecentChats(chats)
      if (_.size(recentChats) > 0) {
        console.log('Answer to: ', _.map(recentChats, ({ chatId, firstName, lastName }) => `${chatId}: ${firstName} ${lastName}`).join(', '))
        const messagePromises = _.map(recentChats, ({ chatId }) => sendMessage({ chatId, text }))
        return Promise.all(messagePromises)
      }
      return Promise.resolve()
    })
    .catch(error => console.log(`Error while get Updates ${error}`))
}

schedule.scheduleJob('*/10 * * * * *', () => {
  answerToMessages('ty for joining us :)')
    .then((message) => {
      if (message) console.log('Following message was sent: ', message)
    })
})
