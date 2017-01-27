/**
 *Created by py on 24/01/2017
 */
'use strict';
const dns = require('dns');
const os = require('os');
module.exports = (serviceName) => {
    let configObject = {};
    let hostName;

    configObject.serviceName = serviceName;

    hostName = os.hostname();

    configObject.init = () => {
        return new Promise(
            (resolve, reject) => {
                dns.lookup(hostName, {family: 4},(err, address, family) => {
                    if(err){reject(err)}
                    configObject.serviceIP = address;
                    resolve(configObject);
                });
            }
        )
    };

    return configObject;

};