Meteor ServerSession
=====================

This package provides a simple serverside implementation of the [Session](http://docs.meteor.com/#session). It uses the same API:

```
ServerSession.set(key, value);
ServerSession.get(key);
ServerSession.equals(key, expected);
```
There's no setDefault now, as it doesn't make any sense to me as of now, write a ticket if you think otherwise.

```
mrt add server-session
```

No tests written yet
