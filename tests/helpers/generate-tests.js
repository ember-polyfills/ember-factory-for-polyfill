import Ember from 'ember';
import hasEmberVersion from 'ember-test-helpers/has-ember-version';
const { getOwner } = Ember;

export default function(test) {

  test('factoryFor + .create results in objects with `owner`', function(assert) {
    assert.noDeprecations(() => {
      let { owner } = this;
      let Factory = owner.factoryFor('fruit:apple');
      let instance = Factory.create();

      assert.equal(getOwner(instance), owner, 'owner of instace created from factoryFor matches environment owner');
    });
  });

  test('factoryFor exposes "raw" .class`', function(assert) {
    assert.noDeprecations(() => {
      let { owner } = this;
      let Factory = owner.factoryFor('fruit:apple');
      let instance = Factory.class.create();

      assert.ok(instance instanceof this.AppleFactory, 'creating an instance with .class results in `instanceof` match');
    });
  });

  // Ember 2.15 and higher do not have `owner._lookupFactory`
  if (!hasEmberVersion(2,15)) {
    test('calling _lookupFactory is not deprecated but functional', function(assert) {
      let { owner } = this;
      let Factory = owner._lookupFactory('fruit:apple');
      let instance = Factory.create();

      assert.equal(getOwner(instance), owner, 'owner of instace created from factoryFor matches environment owner');
    });
  }

  test('factoryFor returns undefined when factory is not registered', function(assert) {
    assert.noDeprecations(() => {
      let { owner } = this;
      let Factory = owner.factoryFor('fruit:orange');

      assert.equal(Factory, undefined, 'factory is undefined');
    });
  });

  if (typeof Proxy !== 'undefined') {
    test('setting properties on Factory results in assertion', function(assert) {
      assert.noDeprecations(() => {
        let { owner } = this;
        let Factory = owner.factoryFor('fruit:apple');

        assert.throws(() => {
          Factory.foo = "huzzah!";
        }, /You attempted to set "foo" on a factory manager created by container#factoryFor. A factory manager is a read-only construct./);
      });
    });
  }
}
