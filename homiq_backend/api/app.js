import express from "express";      // write this when we are using type = module in package.json
// const express = require("express");

import cookieParser from "cookie-parser";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js"

const app = express();

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())

app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);

app.listen(8080, () => {
    console.log("Server is running on port 8080"); 
}); 