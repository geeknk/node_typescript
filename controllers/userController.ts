import * as userServices from "../services/userservices"
import {Request,Response} from "express"

interface reqInterface extends Request{
  data:{
    email:string
    id:string
    page:string
  }
}

export const signup = async (req:Request, res:Response) => {
  try {
    await userServices.usersignup(req.body) 
    userServices.sendEmail({
      to:req.body.email,
      subject: "Registration",
      text:"user registered successfully",
      link:"",
      url:""
    })     
    res.status(201).send({ success: true, msg:"User registered successfully"})
  } catch (error) {
    
  }
  
};

export const signin = async (req:Request, res:Response) => {
  const loggedin = await userServices.token(req.body)
  if (!loggedin) {
    return res.status(401).send({ success: false, msg: "Email or Password is wrong" });
  } else {
    // Assigning refresh token in http-only cookie  
    res.cookie('refresh_token', loggedin.refreshToken, { httpOnly: true,  
      sameSite: 'none', secure: true,  
      maxAge: 24 * 60 * 60 * 1000
    });
    res.status(200).send(loggedin.accessToken);
  }
};

 export const changePass = async (req:Request, res:Response) => {
  const validpass = await userServices.matchpass(req.body)
  if(!validpass){
    return res.status(401).send({success: "failed", message: "password doesn't match" });
  }try {
    userServices.modifyPass(req.data.email, req.body.password);
    userServices.sendEmail({
      to: "ernitish26@gmail.com",
      subject: "Password Reset",
      text: "Password Reset successfully",
      link:"",
      url:""
    })
    res.status(201).send({success: "true", message: "password changed" });
  } catch (error) {
    res.status(401).send({success: "false", message: "password is not changed" });
  }
};

 export const verifyuser = async(req:Request, res:Response) => {
  const validuser = await userServices.verifyemail(req.body.email)
  if(!validuser){
    res.status(401).send({success: "false", message: "user doesn't exist" });
  }else{
    res.status(201).send({success: "true", message: "user exist", token:validuser});
  }
};

 export const forgetPass = async (req:Request, res:Response) => {
  const validpass = await userServices.matchpass(req.body)
  if(!validpass){
    return res.status(401).send({success: "failed", message: "password doesn't match" });
  }try {
    userServices.modifyPass(req.data.email,req.body.password);
    res.status(201).send({success: "true", message: "password updated" });
  } catch (error) {
    res.status(401).send({success: "false", message: "password is not updated" });
  }
};

 export const updateuser = async (req:Request, res:Response) => {
  try {
    const response = await userServices.updateuser1(req.data.email , req.body);
    res.status(201).send({success: "true", message: "user updated successfully", response });
  } catch (error) {
    res.status(402).send({success: "false", message:"user not updated"});
  }
};

//get user data with the help of token (without body)

  export const getuser = async (req:Request, res:Response) => {
  try {
    const userData = await userServices.getdata(req.data.id);
    res.send(userData)
  } catch (error) {
    console.log(error)
    res.status(402).send(error);
  }
};

//get user data with the help of token (without email)

 export const deluser = async (req:Request, res:Response) => {
  try {
    await userServices.deleteuser(req.data.id);
    res.status(201).send({success: "true", message: "user deleted" });
  } catch (error) {
    console.log(error)
    res.status(402).send(error);
  }
};

// get user in the form of list (page wise)

 export const userlist = async (req:Request, res:Response) => {
  try{
    const data = await userServices.user_list(+req.params.page)
    if(data){
      res.status(201).send({success: "true", message: data });
    }
  }catch(error){
    res.status(401).send({success: "false", message: "userdata not found" ,error});
  }
};

// user address

 export const user_address = async (req:Request, res:Response)=>{
  try{
    const data = await userServices.useraddress(req.body,req.data.id)
    if(data){
      res.status(201).send({success: "true", message: "address saved" });
    }else{
      res.status(401).send({success: "false", message: "address not saved"});
    }
  }catch(error){
    res.status(401).send({success: "false", message:error});
  }
};

 export const profileImg = async (req:Request, res:Response)=>{
  if(req.file){
    res.status(201).send({success: "true", message: "image uploaded" });
  }else{
    res.status(401).send({success: "false", message: "failed"});
  }
};

 export const refreshuser = async (req:reqInterface, res:Response) => {
  try {
    const token = await userServices.generateToken(req.data)
    res.cookie('refresh_token', token.refreshToken, { httpOnly: true,  
      sameSite: 'none', secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.status(200).send(token.accessToken);
  } catch (error) {
    res.status(401).send({success: "false",error});
  }
}