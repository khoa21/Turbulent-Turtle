const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./database');

const router = express.Router();

//new user registration
router.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    
    try 
    {
        //hashing password
        const hashedPW = await bcrypt.hash(password, 10);

        //store new usrs to db
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(query, [name, email, hashedPW], (err, result) =>
        {
            if (err) 
            {
                throw err;
            }
            res.status(201).send('Welcome to the party!');
        });
    }
    catch(error)
    {
        res.status(500).send('Something went wrong please try again');
    }
});

//user login
router.post('/login', (req, res) =>
{
    const {email, password} = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) =>
    {
        if (err)
        {
            throw err;
        }

        if (results.length > 0)
        {
            const user = results[0];

            //compare the hashed pw
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch)
            {
                res.status(200).send('Login successfully');
            }

            else
            {
                res.status(400).send('Something is wrong with your info');
            }
        }
        else
        {
            res.status(404).send('User not found');
        }
    });
});

module.exports = router;