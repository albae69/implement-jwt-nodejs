require('dotenv').config()
require('./config/database').connect()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('./model/user')
const auth = require('./middleware/auth')

const express = require('express')
const app = express()
app.use(express.json())

// index
app.get('/', (req, res) => {
    res.json({
        message: '/',
    })
})

// register
app.post('/register', async (req, res) => {
    try {
        // get user input
        const { first_name, last_name, email, password } = req.body

        //validate user input
        if (!(first_name && last_name && email && password)) {
            res.status(400).send('Please fill all the fields')
        }

        // check if user already exists
        // validate if user already exists
        const oldUser = await User.findOne({ email })
        if (oldUser) {
            res.status(409).send('User already exists! Please login')
        }
        // encrypt password
        const hashedPassword = await bcrypt.hash(password, 10)

        // create new user
        const newUser = await User.create({
            first_name,
            last_name,
            email: email?.toLowerCase(),
            password: hashedPassword,
        })

        // create token
        const token = jwt.sign(
            { user_id: newUser._id, email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )
        console.log('sebelum token', newUser)
        //save user token
        newUser.token = token
        console.log('sesudah token', newUser)

        // return new user
        res.status(201).json(newUser)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        // validate user input
        if (!(email && password)) {
            res.status(400).send('Please fill all the fields')
        }

        // check if user already exists
        const user = await User.findOne({ email })
        if (user && (await bcrypt.compare(password, user.password))) {
            // create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.JWT_SECRET,
                {
                    expiresIn: '2h',
                }
            )

            // save user token
            user.token = token
            // return new user
            res.status(200).json(user)
        }
        res.status(401).send('Invalid email or password')
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

app.post('/welcome', auth, (req, res) => {
    res.status(200).send('Welcome')
}) // login

module.exports = app
