import mysql from 'mysql2';
import config from './constant'

export const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database:config.DB,
  password: config.PASS
});

export const dbConnection = async()=>{
    try {
        await con.connect()
        const userTable = `CREATE TABLE IF NOT EXISTS users (
            username VARCHAR(255),
            firstname VARCHAR(255),
            lastname VARCHAR(255),
            email VARCHAR(255),
            mobile VARCHAR(255),
            password VARCHAR(255)
            )`
        con.query(userTable);
        console.log("db connected")
    } catch (error) {
        console.log(error);
    }
}