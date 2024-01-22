const amqp = require('amqplib')
const config = require('../../utils/config')
const { Pool } = require('pg')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError')

const ProducerService = {
    sendMessage: async (queue, message) => {
        const connection = await amqp.connect(config.rabbitMq.server)
        const channel = await connection.createChannel()

        await channel.assertQueue(queue, {
            durable: true
        })

        await channel.sendToQueue(queue, Buffer.from(message))

        setTimeout(() => {
            connection.close()
        }, 1000)
    },
    checkPlaylistId: async ({playlistId}, owner) => {
        const pool = new Pool()
        console.log(playlistId, owner);
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1;',
            values: [playlistId],
          };
      
          const result = await pool.query(query);
      
          if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
          }
      
          const playlist = result.rows[0];
      
        if (playlist.owner !== owner) {
          throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
          
          
    },
}
module.exports = ProducerService