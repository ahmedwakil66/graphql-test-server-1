import express from 'express';
import jwt from 'jsonwebtoken';
import connectToDB from '../dbConfig/dbGql.js';
const router = express.Router();

router.post('/', async (req, res) => {
    const user = req.body.user;
    if(!user || !user.email) {
        res.send({error: true, message: 'must provide a valid user object containing a user email'})
    }
    
    const { userCollection } = await connectToDB();
    const userData = await userCollection.findOne({ email: user.email }, {projection: {_id: 1, role: 1, email: 1}});
    
    if(!userData){
        res.send({error: true, message: 'user does not exists / internal server error'})
    }
    const token = jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: '1h'});
    
    res.cookie("token_ca", token, { 
        expires : new Date(Date.now() + 7*60*60*1000),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
    res.send({success: true, message: "token cookie is sent", token});
})


router.get('/', (req, res) => {
    console.log(req.headers, '<==>', req.cookies);
    res.send('hi there')
})



export default router;