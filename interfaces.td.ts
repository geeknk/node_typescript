import {Request,Response} from 'express'

export interface user {
  id?: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: number;
  password: string;
}
export interface user_address {
  user_id: number;
  address: string;
  city: string;
  state: string;
  pin_code: number;
  phone: number;
}
export interface tokenRequest extends Request {
    data: {
      email?: string,
      token?: string,
      id?: number,
    };
}
export interface reqInterface extends Request{
    data?: {
        [x: string]: string;
      };
}

export interface mailInterface{
  to:string,
  subject: string,
  text:string,
  link:string,
  url:string
}