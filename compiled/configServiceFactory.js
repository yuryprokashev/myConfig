/**
 *Created by py on 24/01/2017
 */
'use strict';

var dns = require('dns');
var os = require('os');
module.exports = function (configObject, EventEmitter) {
    var configService = new EventEmitter();

    var hostName = void 0;

    var copyProperty = void 0,
        returnChildProperty = void 0;

    copyProperty = function copyProperty(fromObj, toObj) {
        for (var key in fromObj) {
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
    };

    returnChildProperty = function returnChildProperty(targetObj, childPropertyName) {
        if (targetObj[childPropertyName] !== undefined) {
            return targetObj[childPropertyName];
        } else {
            return new Error('Child property ' + childPropertyName + ' not exists at ' + JSON.stringify(targetObj));
        }
    };

    configService.read = function (propertyString) {
        if (propertyString === undefined) {
            return configObject;
        } else {
            var pathArray = propertyString.split('.');
            var depth = pathArray.length;
            var firstNode = configObject;
            var i = 0;
            do {
                firstNode = returnChildProperty(firstNode, pathArray[i]);
                if (firstNode instanceof Error) {
                    i = depth;
                } else {
                    i++;
                }
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
                    var error = new Error('error in dns lookup\n' + err);
                    reject(error);
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
