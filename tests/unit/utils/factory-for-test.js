import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import generateTests from '../../helpers/generate-tests';

const { getOwner, Object: EmberObject } = Ember;

moduleFor('factoryFor | ember-test-helpers', {
  integration: true,

  beforeEach() {
    this.AppleFactory = EmberObject.extend();

    this.register('fruit:apple', this.AppleFactory);
    this.owner = getOwner(this);
  }
});

generateTests(test);
