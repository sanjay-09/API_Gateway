const express=require("express");
const morgan=require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit=require("express-rate-limit");
const axios=require("axios");
const app=express();
const bodyParser=require("body-parser");
const PORT=3004;
const limiter=rateLimit({
    windowMs:2*60*1000,
    limit:5
})

app.use(morgan("combined"));
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use("/bookingService",async(req,res,next)=>{
    try{
        
    const token=req.headers['x-access-token'];
        const response=await axios.get("http://localhost:3001/AuthService/api/v1/isAuthenticated",{
        headers:{
            'x-access-token':token
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
app.post("/signup",async(req,res)=>{
    try{
    await axios.post("http://localhost:3001/AuthService/api/v1/user",req.body);
    
    return res.status(200).json({
        result:"true",
        message:"successfully created the user"
    })
 
 
    }
    catch(err){

  
     return res.status(200).json({
        data:"",
 
     })
    }
 })
 app.get("/signIn",async(req,res)=>{
    try{
      const token=await axios.get("http://localhost:3001/AuthService/api/v1/signin",{
        params:{
            email:req.query.email,
            password:req.query.password
        }
      });
      console.log(token.data.data);
    
    return res.status(200).json({
        data:token.data.data,
        result:"true",
        message:"successfully created the user"
    })
 
 
    }
    catch(err){

  
     return res.status(200).json({
        data:err,
 
     })
    }
 })

app.listen(PORT,(req,res)=>{
    console.log(`listening on the port ${PORT}`);
})