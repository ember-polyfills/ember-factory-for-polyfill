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

QUnit.assert.noDeprecations = function(callback) {
  let originalDeprecations = deprecations;
  deprecations = [];

  callback();
  this.deepEqual(deprecations, [], 'Expected no deprecations during test.');

  deprecations = originalDeprecations;
};

QUnit.assert.deprecations = function(callback, expectedDeprecations) {
  let originalDeprecations = deprecations;
  deprecations = [];

  callback();
  this.deepEqual(deprecations, expectedDeprecations, 'Expected deprecations during test.');

  deprecations = originalDeprecations;
};
