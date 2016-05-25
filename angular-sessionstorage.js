/**
 * @license ngSessionStorage
 * (c) 2016 Jan Oetjen <oetjenj@gmail.com>
 * License: MIT
 */
(function (window, angular, storage) {
  'use strict'

  /**
   * @ngdoc module
   * @name ngSessionStorage
   * @description
   *
   * # ngSessionStorage
   *
   * The `ngSessionStorage` module provides a convenient wrapper for reading and writing from and to the browsers'
   * sessionStorage.
   *
   * <div doc-module-components="ngSessionStorage"></div>
   *
   * See {@link ngSessionStorage.$sessionStorage `$sessionStorage`} for usage.
   */

  angular.module('ngSessionStorage', ['ng'])
  /**
   * @ngdoc provider
   * @name $sessionStorageProvider
   * @description
   * Use `$sessionStorageProvider` to change the default behavior of the
   * {@link ngSessionStorage.$sessionStorage $sessionStorage} service.
   */
  .provider('$sessionStorage', [function () {
    /**
     * @ngdoc property
     * @name $sessionStorageProvider#defaults
     * @description
     *
     * Object containing the default options to pass when setting values in the sessionStorage.
     *
     * The object may have the following properties:
     *
     * - **prefix** - `{string}` - This will be prepended to any key when reading and writing values from the
     *   sessionStorage
     */
    var defaults = this.defaults = {}

    /**
     * @ngdoc service
     * @name $sessionStorage
     *
     * @description
     * Provide read/write access to browsers' sessionStorage.
     *
     * @example
     * ```js
     * angular.module('sessionStorageExample', ['ngSessionStorage'])
     * .controller('ExampleController', ['$sessionStorage', function ($sessionStorage) {
     *   // Retrieve a value
     *   var favourite = $sessionStorage.get('myFavorite')
     *   // Setting a value
     *   $sessionStorage.put('myFavorite', 'oatmeal')
     * }])
     * ```
     */
    this.$get = [function () {
      return {
        /**
         * @ngdoc method
         * @name $sessionStorage#get
         *
         * @description
         * Returns the value of given sessionStorage key
         *
         * @param {string} key Id to use for lookup.
         * @param {Object} options Options object.
         *    See {@link ngSessionStorage.$sessionStorageProvider#defaults $sessionStorageProvider.defaults}
         *
         * @returns {string} Raw sessionStorage value.
         */
        get: function (key, options) {
          var opts = calcOptions(options)
          var keyName = [opts['prefix'], key].join('')

          return storage.getItem(keyName)
        },

        /**
         * @ngdoc method
         * @name $sessionStorage#getObject
         *
         * @description
         * Returns the deserialized value of given sessionStorage key
         *
         * @param {string} key Id to use for lookup.
         * @param {Object} options Options object.
         *    See {@link ngSessionStorage.$sessionStorageProvider#defaults $sessionStorageProvider.defaults}
         *
         * @returns {Object} Deserialized sessionStorage value.
         */
        getObject: function (key, options) {
          var opts = calcOptions(options)
          var keyName = [opts['prefix'], key].join('')
          var keyValue = this.get(keyName)

          return keyValue ? angular.fromJson(keyValue) : keyValue
        },

        /**
         * @ngdoc method
         * @name $sessionStorage#getAll
         *
         * @description
         * Returns a key value object with all sessionStorage entries
         *
         * @param {Object} options Options object.
         *    See {@link ngSessionStorage.$sessionStorageProvider#defaults $sessionStorageProvider.defaults}
         *
         * @returns {Object} All sessionStorage entries.
         */
        getAll: function (options) {
          var opts = calcOptions(options)
          var prefix = new RegExp(['^', opts['prefix']].join(''))
          var all = {}

          for (var key in storage) {
            if (storage.hasOwnProperty(key) && prefix.test(key)) {
              all[key] = this.getObject(key)
            }
          }

          return all
        },

        /**
         * @ngdoc method
         * @name $sessionStorage#put
         *
         * @description
         * Set a value for given sessionStorage key
         *
         * @param {string} key Id for the `value`.
         * @param {string} value Raw value to be stored.
         * @param {Object} options Options object.
         *    See {@link ngSessionStorage.$sessionStorageProvider#defaults $sessionStorageProvider.defaults}
         */
        put: function (key, value, options) {
          var opts = calcOptions(options)
          var keyName = [opts['prefix'], key].join('')

          storage.setItem(keyName, value)
        },

        /**
         * @ngdoc method
         * @name $sessionStorage#putObject
         *
         * @description
         * Serializes and sets a value for a given sessionStorage key
         *
         * @param {string} key Id for the `value`.
         * @param {Object} value Value to be stored.
         * @param {Object} options Options object.
         *    See {@link ngSessionStorage.$sessionStorageProvider#defaults $sessionStorageProvider.defaults}
         */
        putObject: function (key, value, options) {
          this.put(key, angular.toJson(value), options)
        },

        /**
         * @ngdoc method
         * @name $sessionStorage#remove
         *
         * @description
         * Remove given sessionStorage entry
         *
         * @param {string} key Id of the key-value pair to delete.
         * @param {Object} options Options object.
         *    See {@link ngSessionStorage.$sessionStorageProvider#defaults $sessionStorageProvider.defaults}
         */
        remove: function (key, options) {
          var opts = calcOptions(options)
          var keyName = [opts['prefix'], key].join('')

          storage.removeItem(keyName)
        }
      }
    }]

    function calcOptions (options) {
      return options ? angular.extend({}, defaults, options) : defaults
    }
  }])
})(window, window.angular, window.sessionStorage)
