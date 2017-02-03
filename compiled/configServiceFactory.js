/**
 *Created by py on 24/01/2017
 */
'use strict';

var dns = require('dns');
var os = require('os');
module.exports = function (configObject) {
    var configService = {};

    var hostName = void 0;

    var copyProperty = void 0,
        returnChildProperty = void 0;

    copyProperty = function copyProperty(fromObj, toObj) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = fromObj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                if (toObj[key] !== undefined) {
                    Object.defineProperty(toObj, key, {
                        configurable: true,
                        enumerable: true,
                        value: fromObj[key],
                        writable: true
                    });
                } else {
                    toObj[key] = fromObj[key];
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    };

    returnChildProperty = function returnChildProperty(targetObj, childPropertyName) {
        if (targetObj[childPropertyName] !== undefined) {
            return targetObj[childPropertyName];
        } else {
            throw new Error('ERROR: child property ' + childPropertyName + ' not exists at ' + targetObj);
        }
    };

    configService.read = function (propertyString) {
        if (propertyString === undefined) {
            return configObject;
        } else {
            var pathArray = propertyString.split('.');
            var depth = pathArray.length;
            var firstNode = configObject;
            do {
                firstNode = returnChildProperty(firstNode, pathArray[i]);
                i++;
            } while (i < depth);
            return firstNode;
        }
    };

    configService.write = function (configData) {
        copyProperty(configData, configObject);
    };

    hostName = os.hostname();

    configService.getEnvObject = function () {
        return new Promise(function (resolve, reject) {
            dns.lookup(hostName, { family: 4 }, function (err, address, family) {
                if (err) {
                    reject(err);
                }
                resolve({
                    serviceName: configObject.serviceName,
                    serviceIP: address
                });
            });
        });
    };
    return configService;
};
