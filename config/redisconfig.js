import { createClient } from 'redis';

export const client = createClient();

export const redisconnect = async () =>{
    try {
        await client.connect();
            console.log("redis connected");
    } catch (error) {
        console.log(error);
    }
}
