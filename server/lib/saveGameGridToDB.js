const {randomUUID} = require('crypto');
const connectionPromise = require('../lib/connPromise.js');

async function saveGameGridToDB(gameGrid) {
	const gameUUID = randomUUID();

	const query = 'INSERT INTO results (`row`, col, color, player, gameId) VALUES ?';
	const values = []; 
    gameGrid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell !== null)
                values.push([rowIndex, colIndex, cell.color, cell.player, gameUUID]);
        });
    });
    
    try {
        await (await connectionPromise).query(query, [values]);
        return gameUUID;
    }
    catch(err) {
        console.log('Error with query', err);
    }
}

module.exports = saveGameGridToDB;