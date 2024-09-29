const { verify } = require("../helpers/jwt");

exports.authorization = (req, res, next) => {
    try {
        const {authorization} = req.headers

        if(!authorization) throw {name: 'UNAUTHENTICATED'}

        const token = authorization.split(' ')[1]

        if(!token) throw {name: 'UNAUTHENTICATED'}

        const user = verify(token)

        if(!user) throw {name: 'UNAUTHENTICATED'}

        req.addOnData = {
            id: user.id,
            username: user.username
        }

        next()
    } catch (error) {
        console.log(error);
    }
}