/**
 *Created by py on 24/01/2017
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var guid = require('./guid');

module.exports = function (configService, kafkaService) {
    var configCtrl = new EventEmitter();

    var write = void 0;

    var configSignature = void 0;

    write = function write(kafkaMessage) {
        var context = void 0;
        context = kafkaService.extractContext(kafkaMessage);
        if (context !== null) {
            configService.write(context.response);
            configCtrl.emit('ready');
            console.log('configCtrl ready');
        } else {
            configCtrl.emit('error', { error: 'kafkaMessage.value is null' });
        }
    };

    configSignature = guid();

    kafkaService.subscribe('get-config-response', configSignature, write);

    configService.getEnvObject().then(function (envObject) {
        kafkaService.send('get-config-request', configSignature, envObject);
    });

    return configCtrl;
};
