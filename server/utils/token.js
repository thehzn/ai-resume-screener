const jwt = require("jsonwebtoken");

exports.generateToken = async(userId,userRole)=>{
    return jwt.sign(
        {userId,userRole},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_IN}
    );
};
exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};