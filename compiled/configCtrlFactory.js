/**
 *Created by py on 24/01/2017
 */
'use strict';

var EventEmitter = require('events').EventEmitter;

module.exports = function (configService, kafkaService) {
    var configCtrl = new EventEmitter();

    var write = void 0;

    write = function write(kafkaMessage) {
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

    kafkaService.subscribe('get-config-response', true, write);

    configService.getEnvObject().then(function (envObject) {
        kafkaService.send('get-config-request', true, envObject);
    });

    return configCtrl;
};
