node_klout
==========

Simple wrapper for the Klout API. Users is an array. The constructor supports passing XML, but I
haven't implemented that yet. Like the API, users is always an array.

I'll write a test or something, too.

```javascript
var Klout = require("node_klout"),
	klout = new Klout("YOUR KEY");

klout.getKlout("registerzero", function(error, users) {
	console.log(users);
});

klout.getShow("registerzero", function(error, users) {
	console.log(users);
});
	
klout.getTopics("registerzero", function(error, users) {
	console.log(users);
});

klout.getInfluencedBy("registerzero", function(error, users) {
	console.log(users);
});

klout.getInfluencerOf("registerzero", function(error, users) {
	console.log(users);
});
```
