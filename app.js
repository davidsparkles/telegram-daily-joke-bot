const Promise = require('bluebird')
const request = require('request-promise')
const _ = require('lodash')
var schedule = require('node-schedule')

const token = '321940604:AAF39SaO9LqWDVXHp9xoYlJzCpSQ33B654Y' 
const baseUrl = `https://api.telegram.org/bot${token}/`

const lastMessage = {
	'8253637': 1488312437
} // chatId: date

function getMe(baseUrl) {
	const url = `${baseUrl}getMe`
	request(url)
		.then(body => console.log('body: ', body))
		.catch(error => console.log('error: ', error))
}

function getUpdates(baseUrl) {
	const url = `${baseUrl}getUpdates`
	const body = {
		limit: 10
	}
	var options = {
    method: 'POST',
    uri: url,
    body: {
        limit: 10
    },
    json: true
	}
	return request(options)
}


function sendMessage(baseUrl, chatId, message) {
	const url = `${baseUrl}sendMessage`
	const body = {
		chat_id: chatId,
		text: message
	}
	var options = {
    method: 'POST',
    uri: url,
    body,
    json: true
	}
	return request(options)
}

function getRecentChats(chatIdsAndDate) {
	return _.chain(chatIdsAndDate)
		.filter(({ chatId, date }) => !lastMessage[chatId] || lastMessage[chatId] < date)
		.each(({ chatId, date }) => {
			if (!lastMessage[chatId] || lastMessage[chatId] < date) lastMessage[chatId] = date
		})
		.map(({ chatId }) => chatId)
		.value()
}

function answerToMessages(baseUrl, message) {
	getUpdates(baseUrl)
		.then(({ ok, result }) => {
			if (!ok) return Promise.reject()
			else {
				const chatIdsAndDate = _.chain(result)
					.map(({ message }) => ({
						chatId: message.chat.id,
						date: message.date
					}))
					.orderBy('date', 'desc')
					.uniqBy(({ chatId }) => chatId)
					.value()
				const recentChatIds = getRecentChats(chatIdsAndDate)
				if (_.size(recentChatIds) > 0) console.log('Answer to: ', recentChatIds.join(', '))
				const messagePromises = _.map(recentChatIds, chatId => sendMessage(baseUrl, chatId, message))

				return Promise.all(messagePromises)
			}
		})
}

const answerJob = schedule.scheduleJob('*/10 * * * * *', function(){
  answerToMessages(baseUrl, 'ty for joining us :)')
})

