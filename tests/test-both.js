Tinytest.add('ServerSession - set', function (test) {
    if (Meteor.isServer) {
        test.isUndefined(ServerSession.setCondition(function () {
            return true;
        }));
    }
    
    test.throws(function () {
            ServerSession.set();
        }, Error, 'Should throw an error if no key and value are provided when using set'
    );

    test.isUndefined(ServerSession.set('testKey', 'testValue'));
    test.equal('testValue', ServerSession.get('testKey'));
    ServerSession.set('testKey');
    test.isTrue(undefined == ServerSession.get('testKey') || null == ServerSession.get('testKey'));
});

Tinytest.add('ServerSession - get', function (test) {
    ServerSession.set('null', null);
    ServerSession.set('aBool', true);
    ServerSession.set('anInteger', 12345);
    ServerSession.set('aString', 'meIzAString');
    ServerSession.set('anArray', [1, 2, 3, ['4', '5', '6', [12, 23, 34]]]);
    ServerSession.set('anObject', { 'keyOfObject' : 'value', 'keyOfObj' : {'a' : ['b', 'c'] } });

    test.equal(null, ServerSession.get('null'));
    test.equal(true, ServerSession.get('aBool'));
    test.equal(12345, ServerSession.get('anInteger'));
    test.equal('meIzAString', ServerSession.get('aString'));
    test.equal([1, 2, 3, ['4', '5', '6', [12, 23, 34]]], ServerSession.get('anArray'));
    test.equal({ 'keyOfObject' : 'value', 'keyOfObj' : {'a' : ['b', 'c'] } }, ServerSession.get('anObject'));
});

Tinytest.add('ServerSession - equals (identical)', function (test) {
    ServerSession.set('null', null);
    ServerSession.set('true', true);
    ServerSession.set('54321', 54321);
    ServerSession.set('aRandomString', 'aRandomString1');
    ServerSession.set('array', [1, 2, 3, ['4', '5', '6', [11, 12, 31]]]);
    ServerSession.set('object', { 'keyOfObject' : '_value'});
    ServerSession.set('emptyObj', {});
    ServerSession.set('emptyArray', []);

    test.isTrue(ServerSession.equals('null', null));
    test.isTrue(ServerSession.equals('true', true));
    test.isTrue(ServerSession.equals('54321', 54321));
    test.isTrue(ServerSession.equals('emptyObj', {}));
    test.isTrue(ServerSession.equals('emptyArray', []));
    test.isTrue(ServerSession.equals('array', [1, 2, 3, ['4', '5', '6', [11, 12, 31]]]));

    test.isFalse(ServerSession.equals('emptyObj', []));
    test.isFalse(ServerSession.equals('emptyArray', {}));
    test.isFalse(ServerSession.equals('aRandomString', 'aRandomString'));
    test.isFalse(ServerSession.equals('array', [1, 2, 3, ['4', '5', '6', [11, 12, 30]]]));
    test.isFalse(ServerSession.equals('object', { 'keyOfObject' : 'value'}));
});

Tinytest.add('ServerSession - equals (not identical)', function (test) {
    ServerSession.set('54321', 1);
    ServerSession.set('null', null);
    ServerSession.set('true', true);
    ServerSession.set('aStringString', 'stringity');

    test.isTrue(ServerSession.equals('null', undefined, false));
    test.isTrue(ServerSession.equals('true', !null, false));
    test.isTrue(ServerSession.equals('54321', true, false));
    test.isFalse(ServerSession.equals('aStringString', 'stringity11', false));
});

if (Meteor.isServer) {
    Tinytest.add('ServerSession - Conditions', function (test) {
        test.isUndefined(ServerSession.setCondition(function () {
            return false;
        }));
        
        test.throws(function () {
            ServerSession.set('theKey', { foo : 'bar' });
        }, Meteor.Error);
        
        test.isFalse(ServerSession.equals('theKey', { foo : 'bar' }));
        
        // Also test with return true
        test.isUndefined(ServerSession.setCondition(function () {
            return true;
        }));
        
        ServerSession.set('newKey', { foo : 'bar' });
        test.equal('bar', ServerSession.get('newKey').foo);
        ServerSession.set('newKey', undefined);
    });
}