/**
 *Created by py on 24/01/2017
 */
'use strict';
const EventEmitter = require('events').EventEmitter;

module.exports = (configService, kafkaService) => {
    let configCtrl = new EventEmitter();

    let write;

    write = (kafkaMessage) => {
        let context, query, data;
        context = kafkaService.extractContext(kafkaMessage);
        if(context !== null) {
            configService.write(context.response);
            configCtrl.emit('ready');
        }
        else {
            configCtrl.emit('error', {error: 'kafkaMessage.value is null'})
        }

    };

    kafkaService.subscribe('get-config-response', true, write);

    configService.getEnvObject().then(
        (envObject) => {
            kafkaService.send('get-config-request', true, envObject);
        }
    );

    return configCtrl;
};
