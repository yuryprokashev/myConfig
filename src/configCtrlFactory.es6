/**
 *Created by py on 24/01/2017
 */
'use strict';
// const EventEmitter = require('events').EventEmitter;
const guid = require('./guid');

module.exports = (configService, kafkaService, EventEmitter) => {
    let configCtrl = new EventEmitter();

    let write;
    
    let configSignature;

    write = kafkaMessage => {
        let context;
        context = kafkaService.extractContext(kafkaMessage);
        if(context !== null) {
            configService.write(context.response);
            let logMessage = configCtrl.packLogMessage(this, 'kafkaMessage.value is null');
            configCtrl.emit('logger.agent.log', logMessage);
            configCtrl.emit('ready');
        }
        else {
            let logMessage = configCtrl.packLogMessage(this, 'kafkaMessage.value is null');
            configCtrl.emit('logger.agent.error', logMessage)
        }

    };

    configSignature = guid();

    let logMessage = configCtrl.packLogMessage(this, `config request signed with ${configSignature}`);
    configCtrl.emit('logger.agent.log', logMessage);

    kafkaService.subscribe('get-config-response', configSignature, write);

    configService.getEnvObject().then(
        (envObject) => {
            kafkaService.send('get-config-request', configSignature, envObject);
        },
        (error) => {
            configCtrl.emit('logger.agent.error', error);
        }
    );

    return configCtrl;
};
