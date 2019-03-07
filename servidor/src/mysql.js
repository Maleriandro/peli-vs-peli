const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'password',
  database: 'competencias',
  insecureAuth: true
});

function queryDB(queryStr) {
	return new Promise(function (resolve, reject) {
		
		connection.query(queryStr, function(error, rows) {
			
			if (error) {
				reject(error);
				
			} else {
				resolve(rows);
				
			}
		})
	})
}

module.exports = queryDB;