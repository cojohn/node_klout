# node_klout

Simple wrapper for the Klout API. Users is an array. The constructor supports passing XML, but I haven't implemented that yet. Like the API, users is always an array.

To run the tests, edit `./test/test.js`, replacing YOUR_KEY with your application's API key, then:

```
node test/test
```

## Version v2

In order to use the `v2` API, instantiate a new instance of node_klout like so:

```javascript
var Klout = require("node_klout"),
	klout = new Klout("YOUR_V2_KEY", "json", "v2");
```

or:

```javascript
var Klout = require("node_klout"),
	klout = new Klout().setKey("YOUR_V2_KEY").setVersion("v2");
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
	// ...
});

klout_v2.getUserScore(klout_id, function(error, klout_response) {
	// ...
});	

klout_v2.getUserTopics(klout_id, function(error, klout_response) {
	// ...
});	
klout_v2.getUserInfluence(klout_id, function(error, klout_response) {
	// ...
});
```


## Version 1

All methods are supported:

```javascript
var Klout = require("node_klout"),
	klout = new Klout("YOUR_KEY");

klout.getKlout("_cojohn", function(error, users) {
	console.log(users);
});

klout.getSingleKlout("_cojohn", function(error, score) {
	console.log(score);
});

klout.getShow("_cojohn", function(error, users) {
	console.log(users);
});
	
klout.getTopics("_cojohn", function(error, users) {
	console.log(users);
});

klout.getInfluencedBy("_cojohn", function(error, users) {
	console.log(users);
});

klout.getInfluencerOf("_cojohn", function(error, users) {
	console.log(users);
});
```
