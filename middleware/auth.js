const jwt = require('jsonwebtoken')

const config = process.env

const veryfyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers['x-access-token']

    if (!token) {
        return res.status(403).send({
            success: false,
            message: 'No token provided.',
        })
    }

    try {
    } catch (error) {
        return res.status(401).send('Invalid Token')
    }
    return next()
}

module.exports = veryfyToken
