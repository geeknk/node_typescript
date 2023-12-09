import dotenv from "dotenv";
dotenv.config();
export default {
    PORT: process.env.PORT_NO,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    db_url: process.env.DB_URL,
    ACCESS_TOKEN_EXPIRES: process.env.JWT_EXPIRY,
    FPASS_EXPIRESIN: process.env.FPASS_EXPIRY,
    API_KEY: process.env.APIKEY,
    EMAIL_FROM: process.env.emailFrom,
    URL: process.env.url,
    URL1: process.env.url1,
    snapURL: process.env.snapurl,
    EMAIL_PASS: process.env.pass,
    DB: process.env.database,
    PASS: process.env.password,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECERET: process.env.CLIENT_SECERET,
    REDIRECT_URI: process.env.REDIRECT_URI,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
    USER: process.env.USER,
};
//export const port : pr
