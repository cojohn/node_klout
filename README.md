# node_klout

Simple wrapper for the Klout API.

To run the tests, edit `./test/test.js`, replacing YOUR_KEY with your application's API key, then:

```
API_KEY=<your Klout API key> node test/test
```

## Version v2

In order to use the `v2` API, instantiate a new instance of node_klout like so:

```javascript
var Klout = require("node_klout"),
	klout = new Klout("YOUR_V2_KEY");
```

Node_klout supports the retrieval of a user's Klout identifier by Twitter screen name or numeric identifier.

```javascript
klout.getKloutIdentity(twitter_screen_name_or_identifier, function(error, klout_user) {
	...
});
```

The returned `klout_user` variable is an object as documented by the Klout API v2 docs:

```
{
	"id": "123456789",
	"network": "ks"
}
```

The following methods are supported, where `klout_response` is an object as documented by the Klout API v2 docs:

```javascript
klout_v2.getUser(klout_id, function(error, klout_response) {
	// Returns a user object
});

klout_v2.getUserScore(klout_id, function(error, klout_response) {
	// Returns a user's score object
});	

klout_v2.getUserTopics(klout_id, function(error, klout_response) {
	// Returns an array of user topics
});	

klout_v2.getUserInfluence(klout_id, function(error, klout_response) {
	// Returns a user's influence object
});

klout_v2.getUserNetworkHandle(klout_id, function(error, klout_response) {
	// Returns a user's network (Twitter) identifier
});
```