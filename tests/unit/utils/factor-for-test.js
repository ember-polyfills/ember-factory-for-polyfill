import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

const { getOwner, Object: EmberObject } = Ember;

moduleFor('owner.factoryFor tests', {
  integration: true,

  beforeEach() {
    this.AppleFactory = EmberObject.extend();

    this.register('fruit:apple', this.AppleFactory);
  }
});

test('factoryFor + .create results in objects with `owner`', function(assert) {
  let owner = getOwner(this);
  let Factory = owner.factoryFor('fruit:apple');
  let instance = Factory.create();

  assert.equal(getOwner(instance), owner, 'owner of instace created from factoryFor matches environment owner');
});

test('factoryFor exposes "raw" .class`', function(assert) {
  let owner = getOwner(this);
  let Factory = owner.factoryFor('fruit:apple');
  let instance = Factory.class.create();

  assert.ok(instance instanceof this.AppleFactory, 'creating an instance with .class results in `instanceof` match');
});

if (typeof Proxy !== 'undefined') {
  test('setting properties on Factory results in assertion', function(assert) {
    let owner = getOwner(this);
    let Factory = owner.factoryFor('fruit:apple');

    assert.throws(() => {
      Factory.foo = "huzzah!";
    }, /You attempted to set "foo" on a factory manager created by container#factoryFor. A factory manager is a read-only construct./);
  });
}
