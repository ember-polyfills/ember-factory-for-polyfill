import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import generateTests from '../helpers/generate-tests';

const {
  getOwner,
  Route,
  Object: EmberObject
} = Ember;

moduleForAcceptance('factoryFor | application', {
  beforeEach() {
    let testContext = this;

    this.AppleFactory = EmberObject.extend();

    this.application.register('fruit:apple', this.AppleFactory);
    this.application.register('route:application', Route.extend({
      init() {
        this._super();
        testContext.owner = getOwner(this);
      }
    }));

    return visit('/');
  }
});

generateTests(test);
