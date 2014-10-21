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