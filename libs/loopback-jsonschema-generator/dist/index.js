'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _schema = require('./schema');

exports.default = function (app, opts) {
  var options = (0, _lodash.defaults)({}, opts, {
    schema: 'http://json-schema.org/draft-04/schema#',
    url: 'json-schema'
  });

  (0, _lodash.each)(app.models, function (model) {
    model.jsonSchema = (0, _schema.generate)(model, options);

    model.getJsonSchema = function (cb) {
      return cb(null, model.jsonSchema);
    };
    model.remoteMethod('getJsonSchema', {
      description: 'Get the json schema for the given loopback model.',
      accessType: 'READ',
      returns: {
        arg: 'schema',
        type: 'string',
        root: true
      },
      isStatic: true,
      http: {
        path: '/' + options.url,
        verb: 'GET'
      }
    });
  });
};

module.exports = exports['default'];