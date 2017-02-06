/**
 *Created by py on 24/01/2017
 */
'use strict';
const EventEmitter = require('events').EventEmitter;
const guid = require('./guid');

module.exports = (configService, kafkaService) => {
    let configCtrl = new EventEmitter();

    let write;
    
    let configSignature;

    write = kafkaMessage => {
        let context;
        context = kafkaService.extractContext(kafkaMessage);
        if(context !== null) {
            configService.write(context.response);
            configCtrl.emit('ready');
            console.log('configCtrl ready');
        }
        else {
            configCtrl.emit('error', {error: 'kafkaMessage.value is null'})
        }

    };

    configSignature = guid();

    kafkaService.subscribe('get-config-response', configSignature, write);

    configService.getEnvObject().then(
        (envObject) => {
            kafkaService.send('get-config-request', configSignature, envObject);
        }
    );

    return configCtrl;
};
