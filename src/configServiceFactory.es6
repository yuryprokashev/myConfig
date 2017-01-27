/**
 *Created by py on 24/01/2017
 */
'use strict';
module.exports = configObject => {
    let configService = {};

    configService.read = (serviceName, propertyName) => {

        if(configObject !== undefined) {
            if(serviceName !== undefined && configObject[serviceName] !== undefined) {
                if(propertyName !== undefined && configObject[serviceName][propertyName] !== undefined) {
                    return configObject[serviceName][propertyName];
                }
                else {
                    return configObject[serviceName];
                }
            }
            else {
                return configObject;
            }
        }
        else {
            return null;
        }
    };

    configService.write = (configData) => {
        configObject = configData;
    };
    return configService;
};