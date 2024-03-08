const express = require('express');
const {randomUUID} = require('crypto');
const CryptoJS = require('crypto-js');
const router = express.Router();
const connection = require('../lib/conn');


// Create new user
router.post('/add', (req, res) => {
    const { name, email, password } = req.body;
    const UUID = randomUUID();
    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.SALT_KEY).toString();

    console.log('passwordet', encryptedPassword);
    console.log('gamla passwordet', password);

    if (!name || !email || !password) {
        res.status(400).json({message: 'Missing required fields'});
        return;
    }

    let queryCheckExists = 'SELECT * FROM users WHERE userEmail = ? OR userName = ?';
    let checkValues = [email, name];
    connection.query(queryCheckExists, checkValues, (existErr, existResult) => {
        if (existErr) {
            console.log('Error with query', existErr);
            res.status(500).json({ error: 'Internal server error'});
            return;
        }

        if (existResult.length !== 0) {
            res.status(400).json({ message: 'User already exists'});
            return;
        }

        let query = 'INSERT INTO users (userName, userEmail, userPassword, UUID) VALUES (?, ?, ?, ?) ';
        let values = [name, email, encryptedPassword, UUID];
        connection.query(query, values, (err, result) => {
            if (err) {
                console.log('Error with query', err);
                res.status(500).json({ error: 'Internal server error'});
                return;
            }
            let newUserResult = {
                userName: name,
                UUID: UUID
            } 
            res.json({message: 'New user created', newUser: newUserResult});
            return;

        });
    });
});

//GET user listing
router.get('/', (req, res) => {
    const query = 'SELECT * FROM users';
    connection.query(query, (err, data) => {
        if (err) {
            console.log('error', err);
        }
        res.status(400).json(data);
    });
});

//Login user
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('client password', req.body);

    if (email) {
        if (!email.includes('@')) {
            res.status(400).json({message: 'Invalid email address'});
            return;
        }

        let queryDbPassword = 'SELECT userPassword, UUID, userName FROM users WHERE userEmail = ?';
        connection.query(queryDbPassword, [email], (passwordErr, dbPasswordResult) => {
            if (passwordErr) {
                console.log('Error with query', passwordErr);
                res.status(500).json({ error: 'Internal server error'});
                return;
            }
            if (dbPasswordResult.length === 0) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const dbPassword = dbPasswordResult[0].userPassword;
            const dbUserName = dbPasswordResult[0].userName;
            const dbUUID = dbPasswordResult[0].UUID;
            //console.log('dbPassword result: ', dbPasswordResult[0].userPassword);
            //console.log('saltvärder', process.env.SALT_KEY);
            let decryptedPassword = CryptoJS.AES.decrypt(dbPassword, process.env.SALT_KEY).toString(CryptoJS.enc.Utf8);
            if (decryptedPassword === password) {
                res.json({UUID: dbUUID, name: dbUserName });
                return;
            } else {
                res.status(401).json({ message: 'Incorrect password' });
                return;
            }
        });
    } else {
        res.status(404).json({ message: 'Please enter email' });
        return;
    }
});








module.exports = router;