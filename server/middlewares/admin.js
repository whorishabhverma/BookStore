const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/config')

function adminMiddleware(req,res,next){
    // const token = req.headers.authorization;
    const token = req.headers.authorization;
    // console.log(`token here`,req.headers.authorization)
    if(!token){
        return res.status(401).json({
            msg : "no token provided"
        })
    }

    try{
        const decodedValue = jwt.verify(token,JWT_SECRET);
        req.user = decodedValue;
        next();
    }catch(error){
        return res.status(403).json({
            msg : "Invalid or expired token"
        })
    }
}

module.exports = adminMiddleware;