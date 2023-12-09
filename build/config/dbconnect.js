var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mysql from 'mysql2';
import config from './constant.js';
export const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: config.DB,
    password: config.PASS
});
export const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield con.connect();
        const userTable = `CREATE TABLE IF NOT EXISTS users (
            username VARCHAR(255),
            firstname VARCHAR(255),
            lastname VARCHAR(255),
            email VARCHAR(255),
            mobile VARCHAR(255),
            password VARCHAR(255)
            )`;
        con.query(userTable);
        console.log("db connected");
    }
    catch (error) {
        console.log(error);
    }
});
