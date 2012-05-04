var Klout = require("../lib/node_klout"),
    klout_v1 = new Klout("rvqe44h4b3w2atm7k4xg7sna"),
    klout_v2 = new Klout("b27wgpx67zarxkq436d7ezgt", "json", "v2"),
	assert = require("assert"),
	events = require("events"),
	util = require("util");

var Test = function() {
	this.failed = 0;
	this.finished = 0;
	this.expected = 8;
	
	events.EventEmitter.call(this);
}

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

// Get Klout identity from Twitter screen name
klout_v2.getKloutIdentity("_cojohn", function(error, klout_user) {
	try {
		assert.equal(klout_user.id, "1212702", "Invalid klout user identity.");
		assert.equal(klout_user.network, "ks", "Invalid network.");
		test.emit("finishedTest");
	}
	catch (ex) {
		test.emit("finishedTest", ex);
	}
});

// Get Klout identity from Twitter id
klout_v2.getKloutIdentity(151230368, function(error, klout_user) {
	try {
		assert.equal(klout_user.id, "1212702", "Invalid klout user identity.");
		assert.equal(klout_user.network, "ks", "Invalid network.");
		test.emit("finishedTest");
	}
	catch (ex) {
		test.emit("finishedTest", ex);
	}
});

klout_v1.getKlout("_cojohn", function(error, klout_response) {
	try {
		assert.equal(isNaN(klout_response.users[0].kscore), false, "Invalid klout score.");
		assert.equal(klout_response.users[0].twitter_screen_name, "_cojohn", "Invalid twitter screen name.");
		test.emit("finishedTest");
	}
	catch (ex) {
		test.emit("finishedTest", ex);
	}
});

klout_v1.getSingleKlout("_cojohn", function(error, score) {
	try {
		assert.equal(isNaN(score), false, "Invalid Klout score.");
		test.emit("finishedTest");		
	}
	catch (ex) {
		test.emit("finishedTest", ex);		
	}

});

klout_v1.getShow("_cojohn", function(error, users) {
	test.emit("finishedTest");
});

klout_v1.getTopics("_cojohn", function(error, users) {
	test.emit("finishedTest");
});

klout_v1.getInfluencedBy("_cojohn", function(error, users) {
	test.emit("finishedTest");
});

klout_v1.getInfluencerOf("_cojohn", function(error, users) {
	test.emit("finishedTest");
});