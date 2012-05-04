var http = require("http");

/*
 * @param {String} key Your Klout API key
 * @param {String} format Your desired out format; json or xml. [optional]
 * @param {Integer} version Desired API version; default to 2.
 */
var Klout = module.exports = function(key, format, version) {
	this._format = (format === "xml" || format === "json") ? format : "json";
	this._key = key = key || "";
	this._version = version || "1";
}

/// Setters ///
Klout.prototype.setFormat = function(format) { this._format = (format === "xml" || format === "json") ? format : "json"; return this; }
Klout.prototype.setKey = function(key) { this._key = key; return this; }
Klout.prototype.setVersion = function(version) { this._version = version; return this; }

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
					callback(new Error("Invalid authentication credentials."));
					break;
				case 403:
					callback(new Error("Inactive key, or call threshold reached."));
					break;
				case 404:
					callback(new Error("Resource or user not found."));
					break;
				case 500:
					callback(new Error("Klout internal server error."));
					break;
				case 502:
					callback(new Error("Klout is down or being upgraded."));
					break;
				case 503:
					callback(new Error("Klout is unavailable."));
					break;
				default:
					switch (true) {
						case /application\/json/.test(klout_response.headers["content-type"]):
							try {
								callback(null, JSON.parse(data));
							}
							catch (ex) {
								callback(ex);
							}
							break;
							
						case /text\/xml/.test(klout_response.headers["content-type"]):
							callback(null, data);						
							break;
							
						default:
							callback(new Error("Unsupported format."));
					}
			};
		});
	}).on("error", function(error) {
		callback(error);
	});	
}

// API methods as documented at http://developer.klout.com/api_gallery
Klout.prototype.getKlout = function(users, callback) { 
	this._get("/klout." + this._format + "?users=" + users + "&", callback); 
}

Klout.prototype.getKloutIdentity = function(id, network, callback) {
	var callback = (network instanceof Function)
			? network
			: callback;
	this._get("/identity." + this._format + (isNaN(id) ? "/twitter?screenName=" + id + "&": "/tw/" + id + "?"), callback);
}


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

Klout.prototype.getShow = function(users, callback) { 
	this._get("/users/show." + this._format + "?users=" + users + "&", callback); 
}
Klout.prototype.getTopics = function(users, callback) { 
	this._get("/users/topics." + this._format + "?users=" + users + "&", callback); 
}
Klout.prototype.getInfluencedBy = function(users, callback) { 
	this._get("/soi/influenced_by." + this._format + "?users=" + users + "&", callback); 
}
Klout.prototype.getInfluencerOf = function(users, callback) { 
	this._get("/soi/influencer_of." + this._format + "?users=" + users + "&", callback); 
}