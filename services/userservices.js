import config from "../config/constant.js";
// const { User,userToken,address } = require("../models");
import {con} from "../config/dbconnect.js"
import { client } from "../config/redisconfig.js"
import { google } from "googleapis"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"
import axios from "axios"
import Cheerio from "cheerio"
import randToken from "rand-token"

const oAuth2Client = new google.auth.OAuth2(config.CLIENT_ID,config.CLIENT_SECERET,config.REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token:config.REFRESH_TOKEN })

const accessToken = async () => {
  const accesstoken = await oAuth2Client.getAccessToken();
  return accesstoken
}

const transport = nodemailer.createTransport({
  service:'gmail',
  auth: {
    type: 'OAuth2',
    user: config.USER,
    clientId: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECERET,
    refreshToken: config.REFRESH_TOKEN,
    accessToken: accessToken()
  },
});

export const getdata = async (id) => {
  try {
    return await con.findOne({ include: address }, { where: { id: id } });
  } catch (error) {
    console.error("Error retrieving data:", error);
    throw error;
  }
};

export const deleteuser = async (id) => {
//   const data = await User.destroy({where:{id: id}},{
//     include: [{
//     model: address,
//     where: { user_id: id },
//   }]
// });/
const data = await address.destroy({where:{user_id: id}},{
  include: [{
  model: User,
  where: { id: id },
}]
});

await User.destroy({where:{id: id}})
  if (data) {
    return true;
  }
};

export const updateuser1 = async (email, body_data) => {
  await User.update(body_data,{where:{email}});
};

export const matchpass = async (data) => {
  return data.password === data.new_password;
};

export const verifyemail = async (data) => {
  const emailexist = await User.findOne({where: {email: data.email}});

  if (emailexist) {
    const token = jwt.sign(
      { email: emailexist.email,id:emailexist._id,username:emailexist.username },
      config.ACCESS_TOKEN_SECRET,
      { expiresIn: config.FPASS_EXPIRESIN }
    );

    const mailOption = {
      from: config.EMAIL_FROM,
      to: "ernitish26@gmail.com",
      subject: "Password Reset Link",
      html: `<a href = "www.google.com">${token}</a>`,
    };
    transport.sendMail(mailOption);
    return token;
  } else {
    return false;
  }
};

export const modifyPass = async (email, data) => {
  await User.update({password: data.password},
    { 
      where:{email}
    }
  );
  const mailOption = {
    from: config.EMAIL_FROM,
    to: "ernitish26@gmail.com",
    subject: "Password Reset",
    text: "Password Reset successfully",
  };
  transport.sendMail(mailOption);
};

export const userlogin = async (data) => {
  const userData = await User.findOne({ where: { email: data.email } });
  const pass = bcrypt.compare(userData.password, data.password);

  if (pass && userData) {
    const accessToken = jwt.sign(
      { email: userData.email, id: userData.id },
      config.ACCESS_TOKEN_SECRET,
      { expiresIn: config.ACCESS_TOKEN_EXPIRES }
    );
    const refreshToken = randToken.uid(256);

    await userToken.create({
      user_id: userData.id,
      token: accessToken,
      expiry: config.JWT_EXPIRES_IN,
    });

    await client.hSet(refreshToken, {
      id: userData.id,
      email: userData.email,
      username:userData.username
    });
    return { accessToken, refreshToken };
  } else {
    return false;
  }
};

export const usersignup = async (data) => {

  const user = await con.query(`INSERT INTO users VALUES(data)`);
  
  if (user) {
    const mailOption = {
      from: config.EMAIL_FROM,
      to: 'rajaryan232326@gmail.com',
      subject: "Registration",
      text: "Registeration successful",
    };
    transport.sendMail(mailOption);
    return user;
  } else {
    return false;
  }
};

export const user_list = async (page) => {
  const firstindex = (page - 1) * 10;
  const lastindex = page * 10;
  const data = await User.findAll();
  const sliced_data = data.slice(firstindex, lastindex);
  return sliced_data;
};

export const useraddress = async (data, ID) => {
  try {
    address.sync();
    let userAdd = await address.create({
      user_id: ID,
      address: data.address,
      city: data.city,
      state: data.state,
      pin_code: data.pin_code,
      phone: data.phone,
    });
    return userAdd;
  } catch (error) {
    console.error(error);
  }
};

export const flipkart = async () => {
  const movie = [];
  try {
    await axios.get(config.URL).then((response) => {
      let $ = Cheerio.load(response.data);
      $("._2n7i6c").each(function (el, index) {
        const name = $(this).find("a._2rpwqI").attr("title");
        const price = $(this).find("div._30jeq3").text();
        const link = $(this).find("a.s1Q9rs").attr("href");
        const rating = $(this).find("div._3LWZlK").text();
        const discount = $(this).find("div._3Ay6Sb").text().split(" ")[0];

        movie.push({
          product_name: name,
          price: price,
          rating: rating,
          discount: discount,
          link: link,
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
  return movie;
};

// Function to scrape the category page and get product URLs
export async function scrapeCategoryPage(categoryUrl) {
  try {
    const response = await axios.get(categoryUrl);
    const productUrls = [];

    const $ = Cheerio.load(response.data);

    $("a.s1Q9rs").each((index, element) => {
      const productUrl = $(element).attr("href");
      productUrls.push(productUrl);
      console.log(productUrls);
    });

    return productUrls;
  } catch (error) {
    console.error("Error scraping category page:", error.message);
    throw error;
  }
}

export const flipkartAll = async () => {
  const movie = [];
  try {
    await axios.get(config.URL1).then((response) => {
      let $ = Cheerio.load(response.data);
      $("._2kHMtA").each(function (el, index) {
        const name = $(this).find("._4rR01T").text();
        const productUrl = $(this).find("a._1fQZEK").attr("href");

        movie.push({ product_name: name, link: productUrl });
      });
    });
  } catch (error) {
    console.log(error);
  }
  return movie;
};

export const snapdeal = async () => {
  const Tshirt = [];
  try {
    await axios.get(config.snapURL).then((response) => {
      let $ = Cheerio.load(response.data);
      $(".favDp.product-tuple-listing.js-tuple").each(function (el, index) {
        const name = $(this).find("p.product-title").attr("title");
        const price = $(this).find("span.product-price").text();
        const link = $(this).find("a.dp-widget-link").attr("href");
        const image = $(this).find("img.product-image").attr("src");
        const discount = $(this)
          .find(".product-discount span")
          .text()
          .split(" ")[0];
        Tshirt.push({
          product_name: name,
          image: image,
          price: price,
          discount: discount,
          link: link,
        });
        console.log(Tshirt);
      });
    });
  } catch (error) {
    console.log(error);
  }
  return Tshirt;
};
export const findByAggregate = async () => {
  //projection
  const data = await DummyData.aggregate([
    { $match: { country: "Vietnam" } },
    { $project: { _id: 0, name: 1, email: 1 } },
  ]);

  /* Skip & Sort Aggregate 
  const d = await DummyData.aggregate([
    {$group: { _id: '$country'}},
    {$sort: { _id:1 }} // 1 for ascending and 2 for descending
  ])

  const data = await DummyData.aggregate([
    {$count:'total'}
  ])
*/
  return data;
};

export const generateToken = async (userData) => {

  const accessToken = jwt.sign(
    { email: userData.email, id: userData.id },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRES }
  );
  const refreshToken = randToken.uid(256);
  await client.hSet(refreshToken, {
    id: userData.id,
    email: userData.email,
    username:userData.username
  });

  return { accessToken, refreshToken };
};