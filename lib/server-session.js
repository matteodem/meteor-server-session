/*global Meteor, ServerSession:true, console */
/*jslint eqeq: true */
ServerSession = (function () {
    'use strict';

    var Collection = new Meteor.Collection('serversession'),
        getSessionValue = function (obj) {
            if (_.isObject(obj)) {
                return obj.value;
            }

            return obj;
        },
        checkForKey = function (key) {
            if (key === undefined) {
                throw new Error('Please provide a key!');
            }
        },
        condition = function () {
            return true;
        };

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
        });
    }

    if (Meteor.isClient) {
        Meteor.subscribe('serversession');
    }

    Meteor.methods({
        'serversession_set' : function (key, value) {
            // Check again, since Meteor.methods is encapsulated
            checkForKey(key);

            if (!condition(key, value)) {
                throw new Meteor.Error('Condition failed (has to be specified on server!)');
            }

            if (!Collection.findOne({ 'key' : key })) {
                Collection.insert({ 'key' : key, 'value' : value });
                return;
            }

            Collection.update({ 'key' : key }, { $set : { 'value' : value }});
        }
    });

    // Return public API
    return {
        'set' : function (key, value) {
            checkForKey(key);
            Meteor.call('serversession_set', key, value);
        },
        'get' : function (key) {
            var sessionObj = Collection.findOne({ 'key' : key });
            return getSessionValue(sessionObj);
        },
        'equals' : function (key, expected, identical) {
            var sessionObj = Collection.findOne({ 'key' : key }),
                value = getSessionValue(sessionObj);

            if (_.isObject(value) && _.isObject(expected)) {
                return _(value).isEqual(expected);
            }

            if (false === identical) {
                return expected == value;
            }

            return expected === value;
        },
        'setCondition' : function (newCondition) {
            if (Meteor.isClient) {
                throw new Meteor.Error('You have to set conditions on the server, not the client!');
            }
            condition = newCondition;
        }
    };
}());