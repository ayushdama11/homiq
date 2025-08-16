import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    
    if(!token) return res.status(401).json({message: "not authenticated"})
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if(err) return res.status(403).json({message: "token is not valid"});

        // using this id we will verify our user, when he/she will delete a post or add post, we will check if the user id of this post is same as the id with which the user has loged in, so that any user cant delete the post of any other user   
        req.userId = payload.id;

        next();
    });
}