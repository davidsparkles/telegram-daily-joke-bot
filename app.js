const Promise = require('bluebird')
const request = require('request-promise')

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
    json: true // Automatically stringifies the body to JSON
};
	request(options)
		.then(body => console.log('body: ', body))
		.catch(error => console.log('error: ', error))
}

getUpdates(baseUrl)