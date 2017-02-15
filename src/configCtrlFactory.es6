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
        let context, isMyMessage, isContextOk;
        context = kafkaService.extractContext(kafkaMessage);
        isMyMessage = kafkaService.isMyMessage(configSignature, kafkaMessage);
        isContextOk = !(context instanceof Error);

        if(isContextOk && isMyMessage === true) {
            configService.write(context.response);
            configCtrl.emit('logger.agent.log', 'write() in configCtrl', 'everything is fine, config is written');
            configCtrl.emit('ready');
        }
        else if (!isContextOk) {
            let error = new Error('kafkaMessage.value is null');
            configCtrl.emit('logger.agent.error', error);
        }
        else if(isMyMessage === false) {
            // configCtrl.emit('logger.agent.log', 'write() in configCtrl', 'message arrived, but it is not mine');
        }
        else {
            // configCtrl.emit('logger.agent.log', 'write() in configCtrl', 'weird thing happened');
        }

    };


    configCtrl.start = () => {

        kafkaService.subscribe('get-config-response', write);

        configService.getEnvObject().then(
            (envObject) => {
                let context;
                context = kafkaService.createContext(configSignature, {}, envObject);
                kafkaService.send('get-config-request', context);
                configCtrl.emit('logger.agent.log', 'configService.getEnvObject', 'env object sent');
            },
            (error) => {
                configCtrl.emit('logger.agent.error', error);
            }
        );

        kafkaService.on('log', (messageString) => {
            configCtrl.emit('logger.agent.log', 'kafkaService', messageString);
        });

        kafkaService.on('error', (err) => {
            configCtrl.emit('logger.agent.error', err);
        });

        configService.on('log', (messageString) => {
            configCtrl.emit('logger.agent.log', 'configService', messageString);
        });

        configService.on('error', (err) => {
            configCtrl.emit('logger.agent.error', err);
        });

    };

    return configCtrl;
};
