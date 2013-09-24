ServerSession = (function () {
    'use strict';

    var Collection = new Meteor.Collection('serversession');

    if (Meteor.isServer) {
        Meteor.publish('serversession', function () {
            return Collection.find();
        });

        Collection.allow({
            'insert' : function () {
                return false;
            },
            'update'  : function () {
                return false;
            },
            'remove' : function () {
                return false;
            }
        })
    }

    if (Meteor.isClient) {
        Meteor.subscribe('serversession');
    }

    Meteor.methods({
        'serversession_set' : function (key, value) {
            if (!Collection.findOne({ 'key' : key })) {
                Collection.insert({ 'key' : key, 'value' : value });
                return ;
            }

            Collection.update({ 'key' : key }, { $set : { 'value' : value }});
        }
    });

    // Return public API
    return {
        'set' : function (key, value) {
            Meteor.call('serversession_set', key, value);
        },
        'get' : function (key) {
            return Collection.findOne({ 'key' : key }).value;
        },
        'equals' : function (key, expected, identical) {
            if ("boolean" == typeof identical && !identical) {
                return expected == Collection.findOne({ 'key' : key }).value;
            }
            return expected === Collection.findOne({ 'key' : key }).value;
        }
    };
}());