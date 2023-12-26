require('dotenv').config();

const Hapi = require('@hapi/hapi');

const albums = require('./api/albums')
const AlbumsService = require('./services/postgres/AlbumsService')
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');

const init = async () => {
    const songsService = new SongsService();
    const albumsService = new AlbumsService();

    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors:{
                origin: ['*']
            }
        }
    })

    // 
    // 
    // // error handling + validation
    // //
    // 
    // 

    await server.register([
        {
            plugin: songs,
            options: {
                service: songsService,
            }
        },
        {
            plugin: albums,
            options: {
                service: albumsService,
            }
        },

    ])


    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();