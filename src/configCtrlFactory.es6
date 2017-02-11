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

    configSignature = guid();

    write = kafkaMessage => {
        let context, isMyMessage;
        context = kafkaService.extractContext(kafkaMessage);
        isMyMessage = kafkaService.isMyMessage(configSignature, kafkaMessage);

        if(context !== null && isMyMessage === true) {
            configService.write(context.response);
            let logMessage = configCtrl.packLogMessage(this, 'kafkaMessage.value is null');
            configCtrl.emit('logger.agent.log', logMessage);
            configCtrl.emit('ready');
        }
        else if (context == null) {
            let logMessage = configCtrl.packLogMessage(this, 'kafkaMessage.value is null');
            configCtrl.emit('logger.agent.error', logMessage)
        }
        else if(isMyMessage === false) {

        }

    };


    configCtrl.start = () => {

        kafkaService.subscribe('get-config-response', write);

        configService.getEnvObject().then(
            (envObject) => {
                let context;
                context = kafkaService.createContext(configSignature, {}, envObject);
                kafkaService.send('get-config-request', context);
                configCtrl.emit('logger.agent.log', 'config controller started');
            },
            (error) => {
                configCtrl.emit('logger.agent.error', error);
            }
        );
    };

    return configCtrl;
};
