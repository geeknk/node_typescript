import * as userServices from "../services/userservices.js"

export const signup = async (req, res) => {
  const data = await userServices.usersignup(req.body)
  if(data){
    res.status(201).send({ success: true, msg:"User registered successfully", data: data });
  }
};

export const signin = async (req, res) => {
  const loggedin = await userServices.userlogin(req.body)
  if (!loggedin) {
    return res.status(401).send({ success: false, msg: "Email or Password is wrong" });
  } else {
    // Assigning refresh token in http-only cookie  
    res.cookie('refresh_token', loggedin.refreshToken, { httpOnly: true,  
      sameSite: 'None', secure: true,  
      maxAge: 24 * 60 * 60 * 1000
    });
    res.status(200).send(loggedin.accessToken);
  }
};

 export const changePass = async (req, res) => {
  const validpass = await userServices.matchpass(req.body)
  if(!validpass){
    return res.status(401).send({success: "failed", message: "password doesn't match" });
  }try {
    userServices.modifyPass(req.data.email,req.body);
    res.status(201).send({success: "true", message: "password changed" });
  } catch (error) {
    res.status(401).send({success: "false", message: "password is not changed" });
  }
};

 export const verifyuser = async(req,res) => {
  const validuser = await userServices.verifyemail(req.body)
  if(!validuser){
    res.status(401).send({success: "false", message: "user doesn't exist" });
  }else{
    res.status(201).send({success: "true", message: "user exist", token:validuser});
  }
};

 export const forgetPass = async (req, res) => {
  const validpass = await userServices.matchpass(req.body)
  if(!validpass){
    return res.status(401).send({success: "failed", message: "password doesn't match" });
  }try {
    userServices.modifyPass(req.data.email,req.body);
    res.status(201).send({success: "true", message: "password updated" });
  } catch (error) {
    res.status(401).send({success: "false", message: "password is not updated" });
  }
};

 export const updateuser = async (req, res) => {
  try {
    const response = await userServices.updateuser1(req.data.email , req.body);
    res.status(201).send({success: "true", message: "user updated successfully", response });
  } catch (error) {
    res.status(402).send({success: "false", message:"user not updated"});
  }
};

//get user data with the help of token (without body)

 export const getuser = async (req, res) => {
  try {
    const userData = await userServices.getdata(req.data.id);
    res.send(userData)
  } catch (error) {
    console.log(error)
    res.status(402).send(error);
  }
};

//get user data with the help of token (without email)

 export const deluser = async (req, res) => {
  try {
    await userServices.deleteuser(req.data.id);
    res.status(201).send({success: "true", message: "user deleted" });
  } catch (error) {
    console.log(error)
    res.status(402).send(error);
  }
};

// get user in the form of list (page wise)

 export const userlist = async (req, res) => {
  try{
    const data = await userServices.user_list(req.params.page)
    if(data){
      res.status(201).send({success: "true", message: data });
    }
  }catch(error){
    res.status(401).send({success: "false", message: "userdata not found" ,error});
  }
};

// user address

 export const user_address = async (req,res)=>{
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

 export const profileImg = async (req,res)=>{
  if(req.file){
    res.status(201).send({success: "true", message: "image uploaded" });
  }else{
    res.status(401).send({success: "false", message: "failed"});
  }
};

 export const flipkartMob = async (req,res)=>{
  try{
    const fkart = await userServices.flipkart()
    if(fkart){
      res.status(201).send({success: "true", message: "userdata found", Data : fkart });
    }
  }catch(error){
    res.status(401).send({success: "false", message: "userdata not found" ,error});
  }
};

 export const flipkartAllMob = async (req,res)=>{
  try{
    const fkart = await userServices.flipkartAll()
    if(fkart){
      res.status(201).send({success: "true", message: "userdata found", Data : fkart });
    }
  }catch(error){
    res.status(401).send({success: "false", message: "userdata not found" ,error});
  }
};
 export const snapdealTshirt = async (req,res)=>{
  try{
    const sdeal = await userServices.snapdeal()
    if(sdeal){
      res.status(201).send({success: "true", message: "userdata found", Data : sdeal });
    }
  }catch(error){
    res.status(401).send({success: "false", message: "userdata not found" ,error});
  }
};
 export const aggregate = async (req,res) => {
  try {
    const data = await userServices.findByAggregate()
    res.status(201).send({success: "true", message: "userdata found", Data : data });
  } catch (error) {
    res.status(401).send({success: "false",error});
  }
}

 export const refreshuser = async (req,res) => {
  try {
    const token = await userServices.generateToken(req.data)
    res.cookie('refresh_token', token.refreshToken, { httpOnly: true,  
      sameSite: 'None', secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.status(200).send(token.accessToken);
  } catch (error) {
    res.status(401).send({success: "false",error});
  }
}