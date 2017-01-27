import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import QUnit from 'qunit';
import Ember from 'ember';

setResolver(resolver);

let deprecations;
Ember.Debug.registerDeprecationHandler((message, options, next) => {
  deprecations.push(message);
  next(message, options);
});

QUnit.testStart(function() {
  deprecations = [];
});

QUnit.assert.noDeprecationsOccurred = function() {
  this.pushResult({
    result: deprecations.length === 0,
    actual: deprecations,
    expected: [],
    message: 'Expected no deprecations during test.'
  });
};

QUnit.assert.deprecationsOccurred = function(deprecationsExpected) {
  this.pushResult({
    result: deprecations.length === deprecationsExpected.length,
    actual: deprecations,
    expected: deprecationsExpected,
    message: 'Expected deprecations during test.'
  });
};
