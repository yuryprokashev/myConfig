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
            isMyMessage = void 0,
            isContextOk = void 0;
        context = kafkaService.extractContext(kafkaMessage);
        isMyMessage = kafkaService.isMyMessage(configSignature, kafkaMessage);
        isContextOk = !(context instanceof Error);

        if (isContextOk && isMyMessage === true) {
            configService.write(context.response);
            configCtrl.emit('logger.agent.log', 'write() in confirCtrl', 'everything is fine, config is written');
            configCtrl.emit('ready');
        } else if (!isContextOk) {
            var error = new Error('kafkaMessage.value is null');
            configCtrl.emit('logger.agent.error', error);
        } else if (isMyMessage === false) {
            configCtrl.emit('logger.agent.log', 'write() in configCtrl', 'message arrived, but it is not mine');
        } else {
            configCtrl.emit('logger.agent.log', 'write() in configCtrl', 'weird thing happened');
        }
    };

    configCtrl.start = function () {

        kafkaService.subscribe('get-config-response', write);

        configService.getEnvObject().then(function (envObject) {
            var context = void 0;
            context = kafkaService.createContext(configSignature, {}, envObject);
            kafkaService.send('get-config-request', context);
            configCtrl.emit('logger.agent.log', 'configService.getEnvObject', 'env object sent');
        }, function (error) {
            configCtrl.emit('logger.agent.error', error);
        });
    };

    return configCtrl;
};
