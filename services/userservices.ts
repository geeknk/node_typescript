import config from "../config/constant.js";
import { con } from "../config/dbconnect.js";
import { client } from "../config/redisconfig.js";
import { google } from "googleapis";
import jwt, { Secret } from "jsonwebtoken";
import nodemailer from "nodemailer";
import randToken from "rand-token";
import { mailInterface, user, user_address } from "../interfaces.td.js";
import { RowDataPacket } from "mysql2";

function verifyEmailF(email: string) {
  return new Promise((res, rej) => {
    con.query(
      `SELECT * FROM users WHERE email=${email}`,
      function (err, result) {
        if (err) rej(err);
        res(result);
      }
    );
  });
}

const oAuth2Client = new google.auth.OAuth2(
  config.CLIENT_ID,
  config.CLIENT_SECERET,
  config.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: config.REFRESH_TOKEN });

const accessToken = async () => {
  const accesstoken = await oAuth2Client.getAccessToken();
  return accesstoken;
};

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAUTH2",
    user: config.USER,
    clientId: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECERET,
    refreshToken: config.REFRESH_TOKEN,
    accessToken: accessToken as unknown as string,
  },
});

export const sendEmail = (option:mailInterface)=>{
  const mailOption = {
    from: config.EMAIL_FROM,
    to: option.to,
    subject: option.subject,
    text: option.text,
    html: `<a href = ${option.url}>${option.link}</a>`,
  };
  transport.sendMail(mailOption);
}

export const getdata = async (id: string) => {
  try {
    return await con.query(
      "SELECT * FROM addresses INNER JOIN users ON addresses.user_id=?",
      id,
      function (err, result) {
        if (err) {
          console.error(err);
        } else {
          return result;
        }
      }
    );
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};

export const deleteuser = async (id: string) => {
  con.query(`DELETE * FROM users WHERE id='${id}'`);
};

export const updateuser1 = async (email: string, body_data: user) => {
  await con.query(`UPDATE users SET '${body_data}' WHERE email='${email}'`);
};

export const matchpass = async (data: {
  password: string;
  new_password: string;
}) => {
  return data.password === data.new_password;
};

export const verifyemail = async (email: string) => {
  // con.query(`SELECT * FROM users WHERE email=${email}`, function (err, result) {
  //   if (err) throw err;
  //   console.log("Result: " + result);
  //   emailexist = result;
  // });

  const emailexist: any = verifyEmailF(email).catch(console.error);
  console.log(emailexist, "emailexistemailexist");
  if (emailexist) {
    const token = jwt.sign(
      {
        email: emailexist.email,
        id: emailexist.id,
        username: emailexist.username,
      },
      config.ACCESS_TOKEN_SECRET as jwt.Secret,
      { expiresIn: config.FPASS_EXPIRESIN }
    );

    return token;
  } else {
    return false;
  }
};


export const modifyPass = async (email: string, password: string) => {
  con.query("UPDATE users SET password= ? WHERE email = ?", [password, email]);
};

export const fetchUserData = async (email: string): Promise<user | null> => {
  try {
    const userData: user = await new Promise((rej, res) => {
      con.query(
        `SELECT * FROM users WHERE email= '${email}'`,
        (err: any, result: RowDataPacket) => {
          if (err) rej(err);
          res(result ? result[0] : null);
        }
      );
    });
    console.log(userData);
    return userData as user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const token = async (userData: {
  id: string;
  username: string;
  email: string;
}) => {
  const accessToken = jwt.sign(
    { email: userData.email, id: userData.id, username: userData.username },
    config.ACCESS_TOKEN_SECRET as jwt.Secret,
    { expiresIn: config.ACCESS_TOKEN_EXPIRES }
  );
  const refreshToken = randToken.uid(256);

  // code for redis to store refresh token

  await client.hSet(refreshToken, {
    id: userData.id,
    email: userData.email,
    username: userData.username,
  });
  return { accessToken, refreshToken };
};

export const usersignup = (data: user) => {
  try {
    con.query(`INSERT INTO users VALUES('${data}')`, data, (err, result) => {
      if (err) throw err;
      console.log(result);
    });

    const mailOption = {
      from: config.EMAIL_FROM,
      to: "rajaryan232326@gmail.com",
      subject: "Registration",
      text: "Registeration successful",
    };
    transport.sendMail(mailOption);

  } catch (error) {
    return error;
  }
};

export const user_list = async (page: number) => {
  const firstindex = (page - 1) * 10;
  const lastindex = page * 10;
  await con.query("SELECT * FROM users", function (err, result) {
    if (err) {
      console.error(err);
    } else {
      let data = result;
    }
  });
};

export const useraddress = async (data: user_address, ID: string) => {
  try {
    con.query(`INSERT INTO addresses VALUES(
      ${ID},
      ${data.address},
      ${data.city},
      ${data.state},
      ${data.pin_code},
      ${data.phone},
    )`)
    
  } catch (error) {
    console.error(error);
  }
};

export const generateToken = async (userData:{email:string,id:string,username:string}) => {
  const accessToken = jwt.sign(
    { email: userData.email, id: userData.id },
    config.ACCESS_TOKEN_SECRET as jwt.Secret,
    { expiresIn: config.ACCESS_TOKEN_EXPIRES }
  );
  const refreshToken = randToken.uid(256);
  await client.hSet(refreshToken, {
    id: userData.id,
    email: userData.email,
    username: userData.username,
  });

  return { accessToken, refreshToken };
};
