import jwt from "jsonwebtoken";

//verify JWT token from cookies, used in context creation function
export const verifyJWT = (cookies) => {
    let userContext = {};
    if (!cookies || !cookies.token_ca) {
        userContext.jwtVerified = false;
        userContext.user = null;
        userContext.message = "A token must be sent with cookies.";
    }
    jwt.verify(cookies.token_ca, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            userContext.jwtVerified = false;
            userContext.user = null;
            userContext.message = "Invalid/expired token found, re-authentication is required."
        }
        else {
            userContext.user = decoded;
            userContext.jwtVerified = true;
        }
    })
    return userContext;
}


//check if user is JWT verified, used in queries and mutations
export const runJwtVerification = (context) => {
    if (!context.jwtVerified) throw new Error("User verification failed, need appropriate token with cookies.");
}


//check if req user id is same as JWT verified user id (same user check)
export const runSameUserCheck = (userId, context) => {
    if(userId.includes('@')) {
        if (userId !== context.user.email) throw new Error("Unauthorized access detected!");
    }
    else {
        if (userId !== context.user._id) throw new Error("Unauthorized access detected!");
    }
}

