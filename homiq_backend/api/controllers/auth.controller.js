import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    const { username, email, password } = req.body;
    // HASH THE PASSWORD
    // CREATE A NEW USER AND SAVE TO DATABASE 
    try {
        const hashPassword = await bcrypt.hash(password, 10);     // returns promise 
        
        console.log(hashPassword);
        
        const newUser = await prisma.user.create({
            data: {
                username, 
                email, 
                password:hashPassword,
            },
        });
        
        console.log(newUser);
        
        res.status(201).json({message: "user created succesfully"});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message : "failed to create a user"});
    }
};



export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // check if user exists in db
        const user = await prisma.user.findUnique({
            where: {username: username}
        });

        if(!user) return res.status(401).json({message: "invalid credentials !!"})

        // check if passowrd is crct 
        const isPswdValid = await bcrypt.compare(password, user.password);

        if(!isPswdValid) return res.status(401).json({message: "invalid credentials !!"})
        
        // if both the conditions written upwards pass, then we will generate cookie and send it to user 
        // res.setHeader("Set-Cookie", "test=" + "myValue").json({message: "success"})
        const age = 1000*60*60*24*7;  

        // jwt token set kr dege -> {payload, secre_key, options}
        const token = jwt.sign(
            {
                id: user.id,
            },
            process.env.JWT_SECRET_KEY,
            {   expiresIn: age  }
        );

        // cookie me jwt token set krdo -> {name, value, options}
        res
            .cookie("token", token, {
                httpOnly: true,     // so that at the client sidde cookie cant be accessible 
                // secure: true     // we have commented it because n it is only used in https connection, not in http
                maxAge: age,
            }) 
            .status(200)
            .json({message: "login successfull !!"});

    } catch(err) {
        console.log(err);
        res.status(500).json({message: "failed to login !!"})
    }
}



export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({message : "logout succesfull !!"})
}