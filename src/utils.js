/**
 *  Copyright (c) 2014 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : LabDNS
 *  File : utils
 *  Date : 10/20/14 6:56 PM
 *  Description :
 *
 */
var dns = require('native-dns');
var conf = require('config');

exports.isARecord = function (record) {
    return record.hasOwnProperty("A");
};

exports.isAAAARecord = function (record) {
    return record.hasOwnProperty("AAAA");
};

exports.isCNAMERecord = function (record) {
    return record.hasOwnProperty("CNAME");
};

exports.isMXRecord = function (record) {
    return record.hasOwnProperty("MX");
};

exports.forwardRequest = function (question, callback) {;
    var req = dns.Request({
        question: question,
        server: { address: conf.forward },
        timeout: 1000
    });

    req.on('timeout', function () {
        console.log('Timeout in making request');
    });


    req.on('message', function (err, result) {
        callback(err, result);
    });

    req.send();
};