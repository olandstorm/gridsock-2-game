const express = require('express');
const {randomUUID} = require('crypto');
const CryptoJS = require('crypto-js');
const router = express.Router();
const connection = require('../lib/conn');



//get specific result
router.get('/:gameId', (req, res) => {
	const gameId = req.params.gameId;

	const query = 'SELECT * FROM results WHERE gameId = ?';
	connection.query(query, [gameId], (err, results) => {
		if (err) {
			console.log('Error with query', err);
			res.status(500).json({ error: 'Internal server error' });
			return;
		}
		const gameGridData = results.map(row => ({
			row: row.row,
			col: row.col,
			color: row.color,
			player: row.player
		}));

		const gameGrid = Array(25).fill().map(() => Array(25).fill(null));
		gameGridData.forEach(cell => {
			gameGrid[cell.row][cell.col] = { color: cell.color, player: cell.player };
			
		});
		res.status(200).json({ gameGrid: gameGrid });
		//console.log('gameGrid', gameGrid);
	})
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