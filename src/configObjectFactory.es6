/**
 *Created by py on 24/01/2017
 */
'use strict';

module.exports = (serviceName, EventEmitter) => {
    let configObject = new EventEmitter();
    configObject.serviceName = serviceName;

    return configObject;
};