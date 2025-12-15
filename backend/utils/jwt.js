const jwt = require("jsonwebtoken");

const secretKey = "firstProject1729"

module.exports=function generateToken(user){
    return jwt.sign({id: user._id, role: user.role},secretKey,{ expiresIn: "1h" });
}

module.exports = function verifyToken(token){
    try{
        return jwt.verify(token,secretKey);
    }catch(err){
        return null;
    }

}