const express=require("express");
const morgan=require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit=require("express-rate-limit");
const axios=require("axios");
const app=express();
const PORT=3004;
const limiter=rateLimit({
    windowMs:2*60*1000,
    limit:5
})

app.use(morgan("combined"));
app.use(limiter);

app.use("/bookingService",async(req,res,next)=>{
    try{
        const response=await axios.get("http://localhost:3001/api/v1/isAuthenticated",{
        headers:{
            'x-access-token':"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFiaGluYXZAZ21haWwuY29tIiwiaWQiOjgsImlhdCI6MTcwNjI2ODMwOSwiZXhwIjoxNzA2MzU0NzA5fQ.Hh8aUwpaJPrnvUc-B1hDV6KlQ5NGiVB2bigPwSFUiH4"
        }
    
    })
   
    console.log(response.data);
    next();

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"unauthorized"
        })
    }

})

app.use("/bookingService",createProxyMiddleware({target:"http://localhost:3002"}));
app.get("/home",(req,res)=>{
    res.send("ok");
})

app.listen(PORT,(req,res)=>{
    console.log(`listening on the port ${PORT}`);
})