/**
 *Created by py on 24/01/2017
 */
'use strict';
// const EventEmitter = require('events').EventEmitter;

var guid = require('./guid');

module.exports = function (configService, kafkaService, EventEmitter) {
    var configCtrl = new EventEmitter();

    var write = void 0;

    var configSignature = void 0;

    write = function write(kafkaMessage) {
        var context = void 0;
        context = kafkaService.extractContext(kafkaMessage);
        if (context !== null) {
            configService.write(context.response);
            var _logMessage = configCtrl.packLogMessage(undefined, 'kafkaMessage.value is null');
            configCtrl.emit('logger.agent.log', _logMessage);
            configCtrl.emit('ready');
        } else {
            var _logMessage2 = configCtrl.packLogMessage(undefined, 'kafkaMessage.value is null');
            configCtrl.emit('logger.agent.error', _logMessage2);
        }
    };

    configSignature = guid();

    kafkaService.subscribe('get-config-response', configSignature, write);

    configService.getEnvObject().then(function (envObject) {
        kafkaService.send('get-config-request', configSignature, envObject);
    }, function (error) {
        configCtrl.emit('logger.agent.error', error);
    });

    return configCtrl;
};
