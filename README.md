Meteor ServerSession
=====================

This package provides a simple serverside implementation of the [Session](http://docs.meteor.com/#session). It uses the same API:

```javascript
ServerSession.set(key, value);
ServerSession.get(key);
ServerSession.equals(key, expected, identical = true);
```
You can also define a condition, which returns true or false (if false it won't set any value)
```javascript
ServerSession.setCondition(function (key, value)); // Should only be invoked on the server
```

There's no setDefault now, as it doesn't make any sense to me as of now, write a ticket if you think otherwise.

```sh
meteor add matteodem:server-session
```

