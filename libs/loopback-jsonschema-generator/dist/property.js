'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

function transformProperty(input) {
  var mapping = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var functions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var property = {};

  // Run each transformation
  mapping.forEach(function (item) {
    // Get the original value
    var originalValue = (0, _lodash.get)(input, item.search.key);

    // Function transformation
    if (item.transform.func && (0, _lodash.has)(input, item.search.key)) {
      // If the property has already been transformed
      // then take the transformed value and not the original input,
      // this will allow for transforms to be chained and not override each other
      if (property[item.search.key]) {
        originalValue = (0, _lodash.get)(property, item.search.key);
      }

      // Run the transformation function on the value
      var transformedValue = functions[item.transform.func](originalValue, {
        mapping: mapping, // Added resources for functions
        functions: functions
      });

      (0, _lodash.set)(property, item.transform.key, transformedValue);

      // Basic value swap transformation
    } else if (item.search.value && new RegExp(item.search.value).test(originalValue)) {
      (0, _lodash.set)(property, item.transform.key, item.transform.value);
    }
  });

  return property;
}

exports.default = {
  transformProperty: transformProperty
};
module.exports = exports['default'];