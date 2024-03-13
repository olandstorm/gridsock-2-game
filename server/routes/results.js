const express = require('express');
const {randomUUID} = require('crypto');
const CryptoJS = require('crypto-js');
const router = express.Router();
const connection = require('../lib/conn');



//get all results


//get specific result
router.get('/', (req, res) => {

})


//save results
router.post('/add', (req, res) => {
	const gameResult = req.body;
	const gameUUID = randomUUID();

	const query = 'INSERT INTO results (row, col, color, player, gameId) VALUES (?, ?, ?, ?, ?)';
	const values = gameResult.map(cell => [cell.row, cell.col, cell.color, cell.player, gameUUID ]);
	
	connection.query(query, [values], (err, results, fields) => {
		if (err) {
			console.log('Error with query', err);
			res.status(500).json({ error: 'Internal server error' });
			return;
		}

		res.status(200).json({message: 'Result was saved successfully', gameId: gameUUID});
		
	});	
});



































module.exports = router;