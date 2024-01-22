const config = {
    app: {
        host: process.env.HOST,
        port: process.env.port,
    },
    jwt:{
        accessToken: process.env.ACCESS_TOKEN_KEY,
        accessTokenAge: process.env.ACCESS_TOKEN_AGE
    },
    rabbitMq: {
        server: process.env.RABBITMQ_SERVER,
    },
    redis: {
        host: process.env.REDIS_SERVER
    }
}
module.exports = config