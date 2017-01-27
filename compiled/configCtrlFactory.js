/**
 *Created by py on 24/01/2017
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
module.exports = function (configService, kafkaService) {
    var configCtrl = new EventEmitter();

    configCtrl.writeConfig = function (kafkaMessage) {
        var context = void 0,
            query = void 0,
            data = void 0;
        context = kafkaService.extractContext(kafkaMessage);
        if (context !== null) {
            configService.write(context.response);
            configCtrl.emit('ready');
        } else {
            configCtrl.emit('error', { error: 'kafkaMessage.value is null' });
        }
    };

    return configCtrl;
};
