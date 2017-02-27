const Promise = require('bluebird')
const request = require('request-promise')
const _ = require('lodash')

const token = '321940604:AAF39SaO9LqWDVXHp9xoYlJzCpSQ33B654Y' 
const baseUrl = `https://api.telegram.org/bot${token}/`

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

getUpdates(baseUrl)
	.then(({ ok, result }) => {
		if (!ok) return Promise.reject()
		else {
			console.log(result)
			const message = 'ty for joining us :)'
			const chatIds = _.chain(result)
				.map(({ message }) => message.chat.id)
				.uniq()
				.value()

			const messagePromises = _.map(chatIds, chatId => sendMessage(baseUrl, chatId, message))

			return Promise.all(messagePromises)
		}
	})
	.then(() => console.log('done'))

