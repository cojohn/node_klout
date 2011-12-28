# node_klout

Simple wrapper for the Klout API. Users is an array. The constructor supports passing XML, but I haven't implemented that yet. Like the API, users is always an array.

To run the tests, edit test/test.js, replacing YOUR_KEY with your application's API key, then:

```
node test/test.js
```

All methods:

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
