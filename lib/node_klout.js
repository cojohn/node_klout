var http = require("http");

/*
 * @param {String} key Your Klout API key
 * @param {String} format Your desired out format; json or xml. [optional]
 */
var Klout = module.exports = function(key, format) {
	this._format = (format === "xml" || format === "json") ? format : "json";
	this._key = key = key || "";
	this._version = "2";
}

/// Setters ///
Klout.prototype.setFormat = function(format) { this._format = (format === "xml" || format === "json") ? format : "json"; return this; }
Klout.prototype.setKey = function(key) { this._key = key; return this; }

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
					switch (true) {
						case /application\/json/.test(klout_response.headers["content-type"]):
							try {
								callback(null, JSON.parse(data));
							}
							catch (ex) {
								callback(ex, klout_response);
							}
							break;
							
						case /text\/xml/.test(klout_response.headers["content-type"]):
							callback(null, data);						
							break;
							
						default:
							callback(new Error("Unsupported format."), klout_response);
					}
			}
		});
	}).on("error", function(error) {
		callback(error);
	});	
};

// API methods as documented at http://developer.klout.com/api_gallery
Klout.prototype.getKlout = function(users, callback) { 
	this._get("/klout." + this._format + "?users=" + users + "&", callback); 
};

Klout.prototype.getKloutIdentity = function(id, network, callback) {
	var callback = (network instanceof Function)
			? network
			: callback;
	this._get("/identity." + this._format + (isNaN(id) ? "/twitter?screenName=" + id + "&": "/tw/" + id + "?"), callback);
};


Klout.prototype.getSingleKlout = function(users, callback) {
	this._get("/klout." + this._format + "?users=" + users + "&", function(error, klout_response) {
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
}

/// Version 2 methods ///

/**
 * Returns a Klout user object.
 *
 * @param {Integer} klout_id The user's Klout identifer
 * @param {Function} callback `callback(error, klout_response)`
 */
Klout.prototype.getUser = function(klout_id, callback) {
	this._get("/user." + this._format + "/" + klout_id + "?", callback);
}

/**
 * Returns a Klout user's score object.
 *
 * @param {Integer} klout_id The user's Klout identifer
 * @param {Function} callback `callback(error, klout_response)`
 */
Klout.prototype.getUserScore = function(klout_id, callback) {
	this._get("/user." + this._format + "/" + klout_id + "/score?", callback);	
}

/**
 * Returns a Klout user's topics array.
 *
 * @param {Integer} klout_id The user's Klout identifer
 * @param {Function} callback `callback(error, klout_response)`
 */
Klout.prototype.getUserTopics = function(klout_id, callback) {
	this._get("/user." + this._format + "/" + klout_id + "/topics?", callback);
}

/**
 * Returns a Klout user's influence object.
 *
 * @param {Integer} klout_id The user's Klout identifer
 * @param {Function} callback `callback(error, klout_response)`
 */
Klout.prototype.getUserInfluence = function(klout_id, callback) {
	this._get("/user." + this._format + "/" + klout_id + "/influence?", callback);
}


Klout.prototype.getUserNetworkHandle = function(klout_id, network, callback) {
	var callback = (network instanceof Function)
			? network
			: callback,
		network = (network instanceof Function)
			? "tw"
			: network;
	
	this._get("/identity." + this._format + "/klout/" + klout_id + "/" + network + "?", callback);
}