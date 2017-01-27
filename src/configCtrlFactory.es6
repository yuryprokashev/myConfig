/**
 *Created by py on 24/01/2017
 */
'use strict';
const EventEmitter = require('events').EventEmitter;
module.exports = (configService, kafkaService) => {
    let configCtrl = new EventEmitter();

    configCtrl.writeConfig = (kafkaMessage) => {
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

    return configCtrl;
};