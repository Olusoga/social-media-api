import Redis from 'ioredis';

const redisClient = new Redis( {
  host: 'localhost', 
  port: 6379,        
} );


redisClient.ping().then( ()=>{

  console.log( 'Connected to Redis' );

} );

export default redisClient;