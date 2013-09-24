Package.describe({
    summary : "Serverside Session through a Meteor.Collection (get, set, equals etc.)"
});

Package.on_use(function (api) {
    api.use('jquery', 'client');
    api.use('underscore', 'client');
    api.use('jquery', 'server');
    api.use('underscore', 'server');

    api.export('ServerSession');

    api.add_files([
        'lib/server-session.js'
    ], ['client', 'server']
    );
});

Package.on_test(function (api) {
    api.use(
        ['server-session', 'tinytest', 'test-helpers']
    );

    api.add_files(
        'tests/test-both.js',
        ['client', 'server']
    );
});