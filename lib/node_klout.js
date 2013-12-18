var http = require("http");

/*
 * @param {String} key Your Klout API key
 * @param {String} format Your desired out format; json or xml. [optional]
 */
var Klout = module.exports = function(key) {
	this._key = key = key || "";
	this._version = "v2";
};

/// Setters ///
Klout.prototype.setKey = function(key) { this._key = key; return this; };

// Make a GET request of the Klout API.
Klout.prototype._get = function(path, callback) {
	var self = this,
		options = {
			host: "api.klout.com",
			path: "/" + self._version + path + "key=" + self._key,
			port: 80
		},
		data = "";

	var klout_request = http.get(options, function(klout_response) {	
		klout_response.on("data", function(chunk) {
			data += chunk;
		});
		klout_response.on("error", function(error) {
			callback(error);
		});
		klout_response.on("end", function() {
			// Handle responses as documented at http://developer.klout.com/docs/read/Profile_Detail
			switch (klout_response.statusCode) {
				case 401:
					callback(new Error("Invalid authentication credentials."), klout_response);
					break;
				case 403:
					callback(new Error("Inactive key, or call threshold reached."), klout_response);
					break;
				case 404:
					callback(new Error("Resource or user not found."), klout_response);
					break;
				case 500:
					callback(new Error("Klout internal server error."), klout_response);
					break;
				case 502:
					callback(new Error("Klout is down or being upgraded."), klout_response);
					break;
				case 503:
					callback(new Error("Klout is unavailable."), klout_response);
					break;
				default:
					if (/application\/json/.test(klout_response.headers["content-type"])) {
						try {
							callback(null, JSON.parse(data));
						}
						catch (ex) {
							callback(ex, klout_response);
						}
					}
					else if (/text\/xml/.test(klout_response.headers["content-type"])) {
						callback(null, data);						
					}
					else {
						callback(new Error("Unsupported format."), klout_response);
					}
			}
		});
	}).on("error", function(error) {
		callback(error);
	});	
};

Klout.prototype.getKloutIdentity = function(id, network, callback) {
    if (network instanceof Function) {
        this._get("/identity.json/twitter?screenName=" + id + "&", network);
    }
    else {
        if (network === 'fb' || /^\d+$/.test(id)) {
            this._get("/identity.json/" + network + "/" + id + "?", callback);
        }
        else {
            this._get("/identity.json/twitter?screenName=" + id + "&", callback);
        }
    }
};


Klout.prototype.getSingleKlout = function(users, callback) {
	this._get("/klout.json?users=" + users + "&", function(error, klout_response) {
		if (error) {
			callback(error);
		}
		else if (klout_response && klout_response.users && klout_response.users.length) {
			callback(null, klout_response.users[0].kscore);
		}
		else {
			callback(null, 0);
		}
	});
};

/// Version 2 methods ///

/**
 * Returns a Klout user object.
 *
 * @param {Integer} klout_id The user's Klout identifer
 * @param {Function} callback `callback(error, klout_response)`
 */
Klout.prototype.getUser = function(klout_id, callback) {
	this._get("/user.json/" + klout_id + "?", callback);
};

/**
 * Returns a Klout user's score object.
 *
 * @param {Integer} klout_id The user's Klout identifer
 * @param {Function} callback `callback(error, klout_response)`
 */
Klout.prototype.getUserScore = function(klout_id, callback) {
	this._get("/user.json/" + klout_id + "/score?", callback);	
};

/**
 * Returns a Klout user's topics array.
 *
 * @param {Integer} klout_id The user's Klout identifer
 * @param {Function} callback `callback(error, klout_response)`
 */
Klout.prototype.getUserTopics = function(klout_id, callback) {
	this._get("/user.json/" + klout_id + "/topics?", callback);
};

/**
 * Returns a Klout user's influence object.
 *
 * @param {Integer} klout_id The user's Klout identifer
 * @param {Function} callback `callback(error, klout_response)`
 */
Klout.prototype.getUserInfluence = function(klout_id, callback) {
	this._get("/user.json/" + klout_id + "/influence?", callback);
};


Klout.prototype.getUserNetworkHandle = function(klout_id, _network, _callback) {
	var callback = (_network instanceof Function)
			? _network
			: _callback,
		network = (_network instanceof Function)
			? "tw"
			: _network;
	
	this._get("/identity.json/klout/" + klout_id + "/" + network + "?", callback);
};
