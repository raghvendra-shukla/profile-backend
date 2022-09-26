var jwt = require('jsonwebtoken');
const JWT_SECRET="Rannyisagood$boy";

const fetchprofile=(req,res,next)=>{
    const token=req.header("auth-token");
    if(!token){res.status(401).send("please enter a valid token")};
    try {
        const data=jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        next();
    } catch (error) {
        res.send("please enter a valid token");
    }
}

module.exports=fetchprofile;