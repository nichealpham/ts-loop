'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _property = require('./property');

var _transforms = require('./mapping/transforms.json');

var _transforms2 = _interopRequireDefault(_transforms);

var _functions = require('./mapping/functions');

var functions = _interopRequireWildcard(_functions);

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }
        newObj.default = obj;
        return newObj;
    }
}

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
}

var generate = function generate(model, options) {
    if (!model.definition || !model.definition.properties) {
        throw new ReferenceError('No valid properties found on this model.');
    }

    Object.keys(model.definition.properties).map(function(objectKey, index) {

        var value = model.definition.properties[objectKey];
        if(!model.definition.properties[objectKey].validations){
            model.definition.properties[objectKey].validations = []
        }
        if(value.required){
            model.definition.properties[objectKey].validations.unshift('required')
        }
        delete model.definition.properties[objectKey].required;
        
    });
    var data = {
        name: model.definition.name,
        properties:model.definition.properties
    }
    return data;
};

exports.default = {
    generate: generate
};
module.exports = exports['default'];