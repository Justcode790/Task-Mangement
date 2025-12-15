const jwt = require("jsonwebtoken");


module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    next();
}



module.exports.verifyJWT = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader);

    if(!authHeader || !authHeader.startsWith("Bearer")){
        console.log("No token provided or invalid format");
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token received:", token ? "Token exists" : "No token");

    jwt.verify(token,"firstProject1729",(err,decoded)=>{
        if (err) {
            console.log("JWT verification error:", err.message);
            return res.status(403).json({ message: "Invalid token", error: err.message });
        }
        // console.log("Token decoded successfully:", decoded);
        req.user=decoded;
        next();
    });
}
