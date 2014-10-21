/**
 *  Copyright (c) 2014 Salama AB
 *  All rights reserved
 *  Contact: aksalj@aksalj.me
 *  Website: http://www.aksalj.me
 *
 *  Project : LabDNS
 *  File : labdns
 *  Date : 10/20/14 3:23 PM
 *  Description :
 *
 */
var debug = require('debug')('LabDNS');
var conf = require('config');
var utils = require("./utils");
var dns = require('native-dns');

var TYPES = dns.consts.NAME_TO_QTYPE;
var RETURN_CODES = dns.consts.NAME_TO_RCODE;


/**
 *
 * @param record
 * @returns {Array}
 */
var getRecordTree = function (record) {
    var result = [];
    if(record.hasOwnProperty("CNAME")) {
        if(conf.records.hasOwnProperty(record.CNAME)){
            var rec = conf.records[record.CNAME];
            result.push({name: record.CNAME, record:rec });
            if (rec.hasOwnProperty("CNAME")) {
                getRecordTree(rec).forEach(function (rc) {
                    result.push(rc);
                });
            }
        }
    }

    return result;
};

/**
 *
 * @param domain
 * @returns {*}
 */
var getRecord = function(domain) {
    var domains = Object.keys(conf.records);
    for(var i = 0; i < domains.length; i++) {
        var key = domains[i];

        var wildcard = key.indexOf("*");
        if(wildcard == -1) {
            if(domain == key) {
                return conf.records[key];
            }
        } else {
            // TODO: Make a regex out of key
            var pattern = key.replace(/\./g, "\\.");
            pattern = pattern.replace(/\*/g, ".+");
            var regex = new RegExp(pattern, "ig");
            if(regex.test(domain)) {
                return conf.records[key];
            }
        }
    }
    return null;
};


module.exports = function () {

    var _onError = null;

    this.setErrorListener = function (listener) {
        _onError = listener;
    };

    this.start = function () {

        var options = {
            dgram_type: conf.ipv6Support === true ? 'udp6' : 'udp4'
        };
        var server = dns.createServer(options);

        server.on('request', function(req, res) {

            var _not_found_ = true;

            req.question.forEach(function(question) {

                var record = question.name ? getRecord(question.name) : null;

                if(record) {
                    _not_found_ = false;

                    switch (question.type) {
                        case TYPES.A:
                            var tree = [];
                            if(utils.isCNAMERecord(record)) {
                                tree = getRecordTree(record);
                            }

                            if(tree.length > 0) { // was CNAME
                                res.answer.push(dns.CNAME({
                                    name: question.name,
                                    data: record.CNAME,
                                    ttl: record.TTL
                                }));

                                tree.forEach(function(rec) {
                                    if(utils.isARecord(rec.record)) {
                                        res.answer.push(dns.A({
                                            name: rec.name,
                                            address: rec.record.A,
                                            ttl: rec.record.TTL
                                        }));
                                    } else if (utils.isCNAMERecord(rec.record)) {
                                        res.answer.push(dns.CNAME({
                                            name: rec.name,
                                            data: rec.record.CNAME,
                                            ttl: rec.record.TTL
                                        }));
                                    }
                                });
                            } else {
                                res.answer.push(dns.A({
                                    name: question.name,
                                    address: record.A,
                                    ttl: record.TTL
                                }));
                            }


                            break;
                        case TYPES.CNAME:
                            if(utils.isCNAMERecord(record)) {
                                res.answer.push(dns.CNAME({
                                    name: question.name,
                                    data: record.CNAME,
                                    ttl: record.TTL
                                }));
                            } else {
                                res.header.rcode = RETURN_CODES.YXDOMAIN;
                            }
                            break
                    }

                }
            });

            if(_not_found_) {
                res.header.rcode = RETURN_CODES.NOTFOUND;
            }

            res.send();
        });

        server.on('error', function(error) {
            if(_onError) {
                _onError(error);
            } else {
                throw error;
            }
        });


        server.on('listening', function () {
            debug("Listening on " + conf.ip + ":" + conf.port);
        });
        server.serve(conf.port, conf.ip);

    } ;

};