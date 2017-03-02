'use strict'

/* eslint-disable import/no-extraneous-dependencies */

// See <https://robots.thoughtbot.com/testing-your-style-with-eslint-and-mocha>

const assert = require('assert')
const CLIEngine = require('eslint').CLIEngine
const glob = require('glob')

const paths = glob.sync('./+(lib|test)/**/*.js')
const engine = new CLIEngine({
  envs: ['node', 'mocha'],
  useEslintrc: true,
})

const results = engine.executeOnFiles(paths).results

function formatMessages(messages) {
  const errors = messages
    .map(message => `${message.line}:${message.column} ${message.message.slice(0, -1)} - ${message.ruleId}\n`)
  return `\n${errors.join('')}`
}

function generateTest(result) {
  const filePath = result.filePath
  const messages = result.messages
    // ignore warnings, such as console.log
    .filter(message => message.severity !== 1)
  it(`validates ${filePath}`, () => {
    if (messages.length > 0) {
      const formattedMessages = formatMessages(messages)
      assert.fail(false, true, formattedMessages)
    }
  })
}

describe('ESLint', () => {
  results.forEach(result => generateTest(result))
})
