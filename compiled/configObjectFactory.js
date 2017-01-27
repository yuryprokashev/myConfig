/**
 *Created by py on 24/01/2017
 */
'use strict';

var dns = require('dns');
var os = require('os');
module.exports = function (serviceName) {
    var configObject = {};
    var hostName = void 0;

    configObject.serviceName = serviceName;

    hostName = os.hostname();

    configObject.init = function () {
        return new Promise(function (resolve, reject) {
            dns.lookup(hostName, { family: 4 }, function (err, address, family) {
                if (err) {
                    reject(err);
                }
                configObject.serviceIP = address;
                resolve(configObject);
            });
        });
    };

    return configObject;
};
