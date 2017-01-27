import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

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

test('factoryFor + .create results in objects with `owner`', function(assert) {
  let { owner } = this;
  let Factory = owner.factoryFor('fruit:apple');
  let instance = Factory.create();

  assert.equal(getOwner(instance), owner, 'owner of instace created from factoryFor matches environment owner');
});

test('factoryFor exposes "raw" .class`', function(assert) {
  let { owner } = this;
  let Factory = owner.factoryFor('fruit:apple');
  let instance = Factory.class.create();

  assert.ok(instance instanceof this.AppleFactory, 'creating an instance with .class results in `instanceof` match');
});

test('factoryFor returns undefined when factory is not registered', function(assert) {
  let { owner } = this;
  let Factory = owner.factoryFor('fruit:orange');

  assert.equal(Factory, undefined, 'factory is undefined');
});

if (typeof Proxy !== 'undefined') {
  test('setting properties on Factory results in assertion', function(assert) {
    let { owner } = this;
    let Factory = owner.factoryFor('fruit:apple');

    assert.throws(() => {
      Factory.foo = "huzzah!";
    }, /You attempted to set "foo" on a factory manager created by container#factoryFor. A factory manager is a read-only construct./);
  });
}
