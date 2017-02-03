/**
 *Created by py on 24/01/2017
 */
'use strict';
const dns = require('dns');
const os = require('os');
module.exports = configObject => {
    let configService = {};

    let hostName;

    let copyProperty,
        returnChildProperty;

    copyProperty = (fromObj, toObj) => {
        for(let key in fromObj) {
            if(toObj[key] !== undefined) {
                Object.defineProperty(toObj, key, {
                    configurable: true,
                    enumerable: true,
                    value: fromObj[key],
                    writable: true
                });
            }
            else {
                toObj[key] = fromObj[key];
            }
        }
    };
    
    returnChildProperty = (targetObj, childPropertyName) => {
        if(targetObj[childPropertyName] !== undefined) {
            return targetObj[childPropertyName];
        }
        else {
            throw new Error(`ERROR: child property ${childPropertyName} not exists at ${JSON.stringify(targetObj)}`);
        }
    };

    configService.read = propertyString => {
        if(propertyString === undefined) {
            return configObject;
        }
        else {
            let pathArray = propertyString.split('.');
            let depth = pathArray.length;
            let firstNode = configObject;
            let i = 0;
            do {
                firstNode = returnChildProperty(firstNode, pathArray[i]);
                i++;
            } while (i < depth);
            return firstNode;
        }
    };


    configService.write = configData => {
        copyProperty(configData, configObject);
    };

    hostName = os.hostname();

    configService.getEnvObject = () => {
        return new Promise(
            (resolve, reject) => {
                dns.lookup(hostName, {family: 4},(err, address, family) => {
                    if(err){reject(err)}
                    resolve({
                        serviceName: configObject.serviceName,
                        serviceIP: address
                    });
                });
            }
        )
    };
    return configService;
};