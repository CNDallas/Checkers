const mysql = require('mysql2');

const pool = mysql.createPool({
	host: "proj-319-048.misc.iastate.edu",
	user: "rmhilby",
	password: "black12",
	database: "factcheckers"
});

// sqlcon.connect(function(err) {
// 	if (err) throw err;
// 	console.log("Connected to SQL");
// });

module.exports = pool.promise();
