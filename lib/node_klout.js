var http = require("http");

/*
 * @params
 * 	key - Your Klout API key
 *	format - Desired format; json or xml (currently unsupported); defaults json.
 *	version - Desired API version; defaults 1.
 */
var Klout = module.exports = function(key, format, version) {
	this._format = (format === "xml" || format === "json") ? format : "json";
	this._key = (typeof key == "string") ? key : "";
	this._version = (version) ? version : 1;
}

// Make a GET request of the Klout API.
Klout.prototype._get = function(method, users, callback) {
	var self = this,
		options = {
			host: "api.klout.com",
			path: "/" + self._version + method + "." + self._format + "?key=" + self._key + "&users=" + users,
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
		klout_response.on("close", function(error) {
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
					self._parse(data, callback);
			};
		});
	}).on("error", function(error) {
		callback(error);
	});	
}

// Parse JSON response data
Klout.prototype._parse = function(data, callback) {
	var parsed, error;
	if (this._format === "json")
		try {
			parsed = JSON.parse(data);
		}
		catch (ex) {
			error = ex;
		}
		finally {
			callback(error, (parsed && parsed.users) ? parsed.users : []);
		}
	else callback(new Error("Unsupported format."));
}

// API methods as documented at http://developer.klout.com/api_gallery
Klout.prototype.getKlout = function(users, callback) { 
	this._get("/klout", users, callback); 
}
Klout.prototype.getShow = function(users, callback) { 
	this._get("/users/show", users, callback); 
}
Klout.prototype.getTopics = function(users, callback) { 
	this._get("/users/topics", users, callback); 
}
Klout.prototype.getInfluencedBy = function(users, callback) { 
	this._get("/soi/influenced_by", users, callback); 
}
Klout.prototype.getInfluencerOf = function(users, callback) { 
	this._get("/soi/influencer_of", users, callback); 
}