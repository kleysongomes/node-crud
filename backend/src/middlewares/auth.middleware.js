const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = {id: decoded.id, email: decoded.email};

            next()
        } catch (error) {
            console.log(error)
            res.status(401).json({message: 'Não autorizado, token inválido'});
        }
    }

    if (!token) {
        res.status(401).json({message: 'Não autorizado, nenhum token encontrado'});
    
    }
});

module.exports = { protect }