'use strict'

const request = require('request-promise')

/* Constants */

const TOKEN = '321940604:AAF39SaO9LqWDVXHp9xoYlJzCpSQ33B654Y'
const BASE_URL = `https://api.telegram.org/bot${TOKEN}/`


/* Outline */

module.exports = {
  getMe: () => getMe(BASE_URL),
  getUpdates: args => getUpdates(BASE_URL, args),
  sendMessage: args => sendMessage(BASE_URL, args)
}

/* Exported functions */

function getMe(baseUrl) {
  const url = `${baseUrl}getMe`
  const options = {
    method: 'GET',
    uri: url,
    json: true
  }
  return request(options)
}

function getUpdates(baseUrl, args = {}) {
  const { limit, offset, timeout, allowed_updates } = args
  const url = `${baseUrl}getUpdates`
  const body = {
    limit,
    offset,
    timeout,
    allowed_updates
  }
  const options = {
    method: 'POST',
    uri: url,
    body,
    json: true
  }
  return request(options)
}

function sendMessage(baseUrl, args = {}) {
  const { chatId, text, parse_mode, disable_notification } = args
  const url = `${baseUrl}sendMessage`
  const body = {
    chat_id: chatId,
    text,
    parse_mode, // 'Markdown' or 'HTML'
    disable_notification
  }
  const options = {
    method: 'POST',
    uri: url,
    body,
    json: true
  }
  return request(options)
}
