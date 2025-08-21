import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken"

export const getPosts = async (req, res) => {
    const query = req.query;
    // console.log(query)
    try {
        const posts = await prisma.post.findMany({
            where: {
                city: query.city || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                bedroom: parseInt(query.bedroom) || undefined,
                price: {
                    gte: parseInt(query.minPrice) || 0,
                    lte: parseInt(query.maxPrice) || 10000000000,
                }
            }
        });

        res.status(200).json(posts);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: "failed to get posts"});
    }
}


export const getPost = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await prisma.post.findUnique({
            where:{id:id},
            include: {
                postDetail: true,
                // ye user mera jo hamne relation banaya hai us se ara hai 
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    }
                },
            }
        });

        let userId;
        const token = req.cookies?.token;
        if(!token) {
            userId = null;
        } 
        else {      // yaha alg se verify islie kr rae hai kyoki hamne ye route pr verifytToken mw use nai kia 
            jwt.verify(token, process.env.JWT_SECRET_KEY, async(err, payload) => {
                if(err) userId = null;
                else {
                    userId = payload.id;
                }
            });
        }

        const saved = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    postId:id,
                    userId,
                }
            }
        })

        res.status(200).json({...post, isSaved: saved ? true : false});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: "failed to get post"});
    }
}


export const addPost = async (req, res) => {
    const tokenUserId = req.userId;
    const body = req.body;
   
    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                postDetail: {
                    create: body.postDetail
                }
            },
        });
        res.status(200).json(newPost);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: "failed to create post !!"});
    }
}


export const updatePost = async (req, res) => {
    try {
        res.status(200).json();
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: "failed to update the post"});
    }
}


export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    try {
        // first find the post whether it is there in the db
        const post = await prisma.post.findUnique({
            where: {id: id},
        });

        // check whethere that particular post belong to this user, if yes then delete
        if(post.userId !== tokenUserId) {
            return res.status(403).json({message : "not authorized !!"})
        }

        await prisma.post.delete({
            where: {id: id},
        })

        res.status(200).json({message: "post deleted successfully"});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: "failed to delete the post"});
    }
}