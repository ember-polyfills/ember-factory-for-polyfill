/* globals Ember, Proxy, define */
(function() {
  'use strict';

  var HAS_NATIVE_PROXY = typeof Proxy === 'function';

  var SAFE_LOOKUP_FACTORY_METHOD = '__' + (Date.now()) + '_lookupFactory';
  function factoryFor(fullName) {
    var factory = this[SAFE_LOOKUP_FACTORY_METHOD](fullName);

    if (!factory) {
      return;
    }

    var FactoryManager = {
      class: factory,
      create: function() {
        return this.class.create.apply(this.class, arguments);
      }
    };

    Ember.runInDebug(function() {
      if (HAS_NATIVE_PROXY) {
        var validator = {
          get: function(obj, prop) {
            if (prop !== 'class' && prop !== 'create') {
              throw new Error('You attempted to access "' + prop + '" on a factory manager created by container#factoryFor. "' + prop + '" is not a member of a factory manager.');
            }

            return obj[prop];
          },
          set: function(obj, prop, value) {
            throw new Error('You attempted to set "' + prop + '" on a factory manager created by container#factoryFor. A factory manager is a read-only construct.');
          }
        };

        // Note:
        // We have to proxy access to the manager here so that private property
        // access doesn't cause the above errors to occur.
        var m = FactoryManager;
        var proxiedManager = {
          class: m.class,
          create: function(props) {
            return m.create(props);
          }
        };

        FactoryManager = new Proxy(proxiedManager, validator);
      }
    });

    return FactoryManager;
  }

  function deprecatedLookupFactory() {
    Ember.deprecate(
      'Using `_lookupFactory` is deprecated. Please use `.factoryFor` instead.',
      false,
      { id: 'container-lookupFactory', until: '2.13.0', url: 'TODO' }
    );

    return this[SAFE_LOOKUP_FACTORY_METHOD].apply(this, arguments);
  };

  if (typeof define === 'function') {
    define('ember-factory-for-polyfill/vendor/ember-factory-for-polyfill/index', ['exports'], function(exports) {
      exports._factoryFor = factoryFor;

      exports._updateSafeLookupFactoryMethod = function(methodName) {
        SAFE_LOOKUP_FACTORY_METHOD = methodName;
      };

      return exports;
    });
  }

  var FactoryForMixin = Ember.Mixin.create({
    init() {
      this._super.apply(this, arguments);
      this[SAFE_LOOKUP_FACTORY_METHOD] = this._lookupFactory;
      this._lookupFactory = deprecatedLookupFactory;
    },

    factoryFor: factoryFor
  });

  // added in Ember 2.8
  if (Ember.ApplicationInstance) {
    // augment the main application's "owner"
    Ember.ApplicationInstance.reopen(FactoryForMixin);
  } else if (Ember.Application.prototype.buildInstance){
    // in Ember < 2.8 the Ember.ApplicationInstance is not
    // exposed globally, so we have to monkey patch the
    // `Ember.Application#buildInstance` method to ensure
    // that the built instance has a `factoryFor` method
    // this gives us support for Ember 2.3 - 2.7
    Ember.Application.reopen({
      buildInstance: function(_options) {
        var options = _options || {};
        options.factoryFor = factoryFor;
        // to shape the object properly
        options[SAFE_LOOKUP_FACTORY_METHOD] = function() {};

        var instance = this._super(options);

        instance[SAFE_LOOKUP_FACTORY_METHOD] = options._lookupFactory;
        instance._lookupFactory = deprecatedLookupFactory;

        return instance;
      }
    });
  }

  // added in Ember 2.3
  if (Ember._ContainerProxyMixin) {
    // supports ember-test-helpers's build-registry (and other tooling that use
    // Ember._ContainerProxyMixin to emulate an "owner")
    var ContainerProxyMixinWithFactoryFor = Ember.Mixin.create(Ember._ContainerProxyMixin, FactoryForMixin);
    Ember._ContainerProxyMixin = ContainerProxyMixinWithFactoryFor;
  }
})();
