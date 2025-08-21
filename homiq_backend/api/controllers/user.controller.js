import prisma from "../lib/prisma.js"
import bcrypt from "bcrypt"

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } 
    catch(err) {
        console.log(err);
        res.status(500).json({message : "failed to get users !!"});
    }
}


export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
        })

        res.status(200).json(user);
    } 
    catch(err) {
        console.log(err);
        res.status(500).json({message : "there is no user !!"});
    }
}


export const updateUser = async (req, res) => {
    const id = req.params.id;

    // we have already extracted the userId in the verifyToken
    const tokenUserId = req.userId;

    // agar passowrd bhi update hora hai to use hash krke update krna hai in the db 
    const {password, avatar, ...inputs} = req.body;

    if(id !== tokenUserId) {    // meeans we are not owner 
        return res.status(403).json({message: "not authorized"});
    }

    let updatedpswd = null;

    try {
        if(password) {
            updatedpswd = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: {id},
            data: {
                ...inputs,
                ...(updatedpswd && { password: updatedpswd }),      // agr updatedpswd null nai hai to db me updatedpswd jo hai wahi mera pswd hoga 
                ...(avatar && { avatar }),
            },
        });

        const {password: userPassword, ...restfields} = updatedUser; 

        res.status(200).json(restfields);
    } 
    catch(err) {
        console.log(err);
        res.status(500).json({message : "failed to get users !!"});
    }
}



export const deleteUser = async (req, res) => {

    const id = req.params.id;
    const tokenUserId = req.userId;
    
    if(id !== tokenUserId) {
        return res.status(403).json({message: "not authenticated"});
    }

    try {
        await prisma.user.delete({
            where: {id}
        }) 
        res.status(200).json({message: "user deleted !!"})
    } 
    catch(err) {
        console.log(err);
        res.status(500).json({message : "failed to get users !!"});
    }
}


export const savePost = async (req, res) => {
    const postId = req.body.postId;
    const tokenUserId = req.userId;

    try {
        const savedPost = await prisma.savedPost.findUnique({
            where: {
                // ye userId_postId composite key se ata hai jo hamne schema.prisma me likha hai for savedPosts
                userId_postId: {
                    userId: tokenUserId,
                    postId: postId,
                }
            }
        })

        // agr pehle se save h to agar koi us button pr click kre to use unsave kro nai to firse save kro 
        if(savedPost) {
            await prisma.savedPost.delete({
                where: {
                    id: savePost.id,
                }
            }); 
            res.status(200).json({message: "post removed from savedList"})
        }
        else {
            await prisma.savedPost.create({
                data: {
                    userId: tokenUserId,
                    postId,
                },
            });
            res.status(200).json({message: "post saved in the savedList"})
        }
    }
    catch (err){
        return res.status(500).json({message : "failed to save the post"});
    }
}


export const profilePosts = async (req, res) => {
    const tokenUserId = req.params.userId;
    try {
        const userPosts = await prisma.post.findMany({
            where: { userId: tokenUserId },
        })
        const saved = await prisma.savedPost.findMany({
            where: {userId: tokenUserId},
            include: {
                post: true,
            },
        });
 
        const savedPosts = saved.map(item => item.post)

        res.status(200).json({userPosts, savedPosts});
    } 
    catch(err) {
        console.log(err);
        res.status(500).json({message : "failed to get user profile posts !!"});
    }
}