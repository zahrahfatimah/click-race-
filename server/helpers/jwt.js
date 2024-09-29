const jwt = require('jsonwebtoken')
const key = 'hola'

exports.signToken = (payload) => {
    return jwt.sign(payload, key)
}

exports.verify = (token) => {
    return jwt.verify(token, key)
}
