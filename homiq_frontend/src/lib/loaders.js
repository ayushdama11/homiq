import { defer } from "react-router-dom";
import apiRequest from "./apiRequests"

// jo bhi kam mera component load hone se pehle karna hota hai na uske lie ham ye loaders use krte hai jo hame react router dom se milta hai 

// ye loader backend ke /posts/id wale route pr jaega -> aur jo bhi data hai wo singlePg ko lakr dega taki ham user ko uske post ka data frontend pr dikha ske 
// by default get request hi hogi agar ham explicitly kuch mention na kare to 
export const singlePageLoader = async ({request, params}) => {
    const res = await apiRequest("/posts/"+params.id)
    return res.data;
}

export const listPageLoader = async ({request, params}) => {
    // console.log(request);

    // .split will give us array having, data before ? and data after ? , we want after ? so we have wrote [1] -> 1st element
    const query = request.url.split("?")[1]
    const postPromise = apiRequest("/posts?" + query)
    return defer({    
        postResponse:postPromise
    });
}  

export const profilePageLoader = async() => {
    const postPromise = apiRequest("/users/profilePosts");
    return defer({
        postResponse: postPromise
    })
}