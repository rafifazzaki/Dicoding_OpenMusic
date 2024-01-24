const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');


class LikesService{
    constructor(){
        this._pool = new Pool()
    }

    async addLikeToAlbum(albumId, userId){
        const id = `like-${nanoid(16)}`;


        const likeCheckQuery = {
            text: 'SELECT id FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
            values: [albumId, userId]
        }

        const likeCheckResult = await this._pool.query(likeCheckQuery);

        if(likeCheckResult.rows.length){
            throw new InvariantError('album sudah di like')
        }

        const albumCheckQuery = {
            text: 'SELECT id FROM albums WHERE id = $1',
            values: [albumId],
          };

        const albumCheckResult = await this._pool.query(albumCheckQuery);

        if (!albumCheckResult.rows.length) {
            throw new NotFoundError('albumId tidak ditemukan');
        }
        console.log(albumId, userId);
        const query = {
            text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id;',
            values: [id, userId, albumId]
        }

        const result = await this._pool.query(query)

        if(!result.rows.length){
            throw InvariantError('Like gagal ditambahkan')
        }

        return result.rows[0]
    }
    
    async deleteAlbumById(albumId, userId){
        const query = {
            text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
            values: [albumId, userId]
        }

        const result = await this._pool.query(query)
        
        if(!result.rows.length){
            throw new InvariantError('Like gagal dihapus')
        }
    }

    async getAlbums(albumId){
        const query = {
            text: 'SELECT COUNT(DISTINCT user_id) FROM user_album_likes WHERE album_id = $1;',
            values: [albumId]
        }

        const result = await this._pool.query(query)
        return result.rows[0]
    }


}
module.exports = LikesService