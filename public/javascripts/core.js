/// Sets up connection to mySql Database

var mysql = require('mysql');


/// connection localhost database
/// Consists of two tables

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'subwhe5',
	database: 'countmeup'
});




/// error checking for connection to database

connection.connect(function (err) {
	if (!err) {
		console.log("Database is connected ... nn");
	} else {
		console.log("Error connecting database ... nn");
	}
});



/// Displays Overall Candidate Votes
/// Uses MySql to add up total number of voites

exports.getCandidatesVotes = function (req, res) {

	connection.query('SELECT CandID, sum(Times) as no_votes from tbl_candidate_vote group by CandID ', function (err, rows, fields) {
		connection.end();
		if (!err) {
			console.log('The solution is: ', rows);
			res.send(rows);

		} else {
			console.log('Error while performing Query.');
		}
	});

};


/// Main function of program to addvotes to each candidate
/// Uses MySql

exports.addVote = function (req, res) {
	voterid = req.params.voterid
	candid = req.params.candidateid

	connection.query('Select * from tbl_candidate_vote WHERE Voterid="' + voterid + '" and candid="' + candid + '"', function (err, rows, fields) {
		
		no_of_rows = rows.length;


		/// Checks to see if there is an exisiting vote for candidate, if not then create vote for candidate
		if (no_of_rows == 0) {
			query_string = 'insert into tbl_candidate_vote VALUES ("' + candid + '", "' + voterid + '", 1)';
			connection.query(query_string, function (err, result) { });
			res.status(201);
		} else {

			/// using a Group BY sql statement to check the number of votes cast by a single voter
			query_string = 'select sum(times) as times from tbl_candidate_vote WHERE voterid="' + voterid + '" group by voterid';
			connection.query(query_string, function (err, rows) {

				record = rows[0]
				times = record["times"];
				// if number of times a voter has vote exceeds 3 then an error is returned
				if (times >= 3) {
					console.log('Error, too many votes for one voter.');
					res.status(403)
				} else {
					// The number of votes for a candidate from a single voter is increased by 1
					connection.query('update tbl_candidate_vote SET times = times + 1 WHERE voterid="' + voterid + '" and candid="' + candid + '"', function (err, result) { });
					res.status(201);
				}
			})
		}
	});
	
	
}

exports.deleteCandidate = function (req, res) {

	
}

