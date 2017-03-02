'use strict'

const assert = require('assert')

const telegram = require('../lib/telegram')


describe('Telegram Wrapper', () => {
  it('should get me', () => {
    const expectedResponse = {
      ok: true,
      result: {
        id: 321940604,
        first_name: 'DailyGermanJokeBot',
        username: 'DailyGermanJokeBot'
      }
    }
    return telegram.getMe()
      .then((actualResponse) => {
        assert.deepEqual(actualResponse, expectedResponse)
      })
  })
  it('should getUpdates', () => telegram.getUpdates()
    .then((actualResponse) => {
      assert.deepEqual(actualResponse.ok, true)
    })
  )
  it('should sendMessage', () => {
    const text = 'test text'
    const chatId = '8253637'
    return telegram.sendMessage({ text, chatId })
      .then((actualResponse) => {
        assert.deepEqual(actualResponse.ok, true)
      })
  })
})
