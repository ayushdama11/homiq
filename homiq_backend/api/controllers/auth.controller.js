import bcrypt from "bcrypt";

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    // HASH THE PASSWORD
    // CREATE A NEW USER AND SAVE TO DATABASE 
    const hashPassword = await bcrypt.hash(password, 10);     // returns promise 

    console.log(hashPassword);
}

export const login = (req, res) => {
    
}

export const logout = (req, res) => {

}