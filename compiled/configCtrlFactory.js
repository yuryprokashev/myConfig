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

    configSignature = guid();

    write = function write(kafkaMessage) {
        var context = void 0,
            isMyMessage = void 0;
        context = kafkaService.extractContext(kafkaMessage);
        isMyMessage = kafkaService.isMyMessage(configSignature, kafkaMessage);

        if (context !== null && isMyMessage === true) {
            configService.write(context.response);
            var logMessage = configCtrl.packLogMessage(undefined, 'kafkaMessage.value is null');
            configCtrl.emit('logger.agent.log', logMessage);
            configCtrl.emit('ready');
        } else if (context == null) {
            var _logMessage = configCtrl.packLogMessage(undefined, 'kafkaMessage.value is null');
            configCtrl.emit('logger.agent.error', _logMessage);
        } else if (isMyMessage === false) {}
    };

    configCtrl.start = function () {

        kafkaService.subscribe('get-config-response', write);

        configService.getEnvObject().then(function (envObject) {
            var context = void 0;
            context = kafkaService.createContext(configSignature, {}, envObject);
            kafkaService.send('get-config-request', context);
        }, function (error) {
            configCtrl.emit('logger.agent.error', error);
        });
    };

    return configCtrl;
};
