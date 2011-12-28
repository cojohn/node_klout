var Klout = require("../lib/node_klout"),
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