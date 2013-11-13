if(!process.env.API_KEY){
    console.log("!!! Please specify your Klout API key using the API_KEY argument.");
    process.exit();
}

var Klout = require("../lib/node_klout");
var klout_v2 = new Klout(process.env.API_KEY);
var assert = require("assert");
var events = require("events");
var util = require("util");

var Test = function() {
	this.failed = 0;
	this.finished = 0;
	this.expected = 7;
	
	events.EventEmitter.call(this);
};

util.inherits(Test, events.EventEmitter);
var test = new Test();

test.on("finishedTest", function(error) {
	if (error) {
		console.error(error);
		this.failed++;
	}
	
	this.finished++;
	
	if (this.finished === this.expected) {
		console.log("Finished " + this.expected + " test. (" + this.failed + " failed)");
		process.exit();
	}
});

test.on("runVersionTwoTests", function(klout_id) {
	klout_v2.getUser(klout_id, function(error, klout_response) {
		try {
			assert.equal(klout_response.kloutId, "" + klout_id, "Incorrect Klout user returned.");
			test.emit("finishedTest");	
		}
		catch (ex) {
			test.emit("finishedTest", ex);	
		}
	});
	klout_v2.getUserScore(klout_id, function(error, klout_response) {
		try {
			assert.equal(isNaN(klout_response.score), false, "Score not returned.");
			test.emit("finishedTest");	
		}
		catch (ex) {
			test.emit("finishedTest", ex);	
		}
	});	
	klout_v2.getUserTopics(klout_id, function(error, klout_response) {
		try {
			assert.equal(util.isArray(klout_response), true, "No topics returned.");
			test.emit("finishedTest");	
		}
		catch (ex) {
			test.emit("finishedTest", ex);	
		}
	});	
	klout_v2.getUserInfluence(klout_id, function(error, klout_response) {
		try {
			assert.equal(util.isArray(klout_response.myInfluencers), true, "No influencers returned.");
			assert.equal(util.isArray(klout_response.myInfluencees), true, "No influencees returned.");
			test.emit("finishedTest");	
		}
		catch (ex) {
			test.emit("finishedTest", ex);	
		}
	});	
	klout_v2.getUserNetworkHandle(klout_id, function(error, klout_response) {
		try {
			assert.equal(klout_response.network, "tw", "Invalid network.");
			assert.equal("" + klout_response.id, "" + 151230368, "Invalid network identifier.");			
			test.emit("finishedTest");	
		}
		catch (ex) {
			test.emit("finishedTest", ex);	
		}
	});
});


// Get Klout identity from Twitter screen name
klout_v2.getKloutIdentity("_cojohn","tw", function(error, klout_user) {
	try {
		assert.equal(klout_user.id, "1212702", "Invalid klout user identity.");
		assert.equal(klout_user.network, "ks", "Invalid network.");
		test.emit("runVersionTwoTests", klout_user.id);
		test.emit("finishedTest");
	}
	catch (ex) {
		test.emit("finishedTest", ex);
	}
});

// Get Klout identity from Twitter id
klout_v2.getKloutIdentity(151230368, 'tw', function(error, klout_user) {
	try {
		assert.equal(klout_user.id, "1212702", "Invalid klout user identity.");
		assert.equal(klout_user.network, "ks", "Invalid network.");
		test.emit("finishedTest");
	}
	catch (ex) {
		test.emit("finishedTest", ex);
	}
});