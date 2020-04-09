// var sinon = require('sinon')
// var assert = require('assert')
// var sm = require('./statemachine.js')

test('constructor saves init values', () => {
  var entModellerFactory = {
    state1: {
      create: function () {
        return 1
      }
    },
    state2: {
      create: function () {
        return new 2()
      }
    }
  }
  });

