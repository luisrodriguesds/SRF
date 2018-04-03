exports.checkAuth = function(req, callback) {
	var db = req.db;
	var users = db.get('users');
	var session = req.session;

	if(session.secret_code != null) {
		var secret_code = session.secret_code;

		var tokens = secret_code.split("\t");

		users.findOne({_email: tokens[0]}).then((user) => {
			if(user == null) { 
				callback(false);
			}
			else {
				var password_hash = user._password;
				var session_password = tokens[1];

				if(password_hash != session_password) {
					callback(false);
				} 
				else {
					callback(user);
				}
			}
		}); 
	} else {
		callback(false);
	}
}