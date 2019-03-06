'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recurProperties = exports.returnValue = exports.lowercase = undefined;

var _lodash = require('lodash');

var _property = require('../property');

/**
 * Transformation Functions
 */

var lowercase = exports.lowercase = function lowercase(input) {
  return input.toLowerCase();
};

var returnValue = exports.returnValue = function returnValue(input) {
  return input;
};

var recurProperties = exports.recurProperties = function recurProperties(input) {
  var resources = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return (0, _lodash.mapValues)(input, function (value) {
    return (0, _property.transformProperty)(value, resources.mapping, resources.functions);
  });
};