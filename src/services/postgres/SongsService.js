const { nanoid } = require('nanoid');
const { Pool } = require('pg')
const { mapDBToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService{
    constructor(){
        this._pool = new Pool()
    }

    async addSong({ title, year, genre, performer, duration, albumId }){
        const id = "song-" + nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt]
        }

        const result = await this._pool.query(query)

        if(!result.rows[0].id){
            throw InvariantError('Song gagal ditambahkan')
        }

        return result.rows[0].id
    }

    async getSongs({title, performer}){
        var query, result
        
        if(title !== '' && performer !== ''){
            query = {
                text: "SELECT * FROM songs WHERE title LIKE '%' || $1 || '%' AND performer LIKE '%' || $2 || '%';",
                values: [title, performer]
            }
        }else if(title !== ''){
            query = {
                text: "SELECT * FROM songs WHERE title LIKE '%' || $1 || '%';",
                values: [title]
            }
        }
        else if(performer !== ''){
            query = {
                text: "SELECT * FROM songs WHERE performer LIKE '%' || $1 || '%';",
                values: [performer]
            }
        }else{
            query = {
                text: "SELECT id, title, performer FROM songs"
            }
        }
        result = await this._pool.query(query)
        return result.rows.map(mapDBToModel)

        
    }

    async getSongById(id){
        const query = {
            text: 'SELECT id, title, year, performer, genre, duration, "albumId" from songs WHERE id = $1',
            values: [id],
        }
        
        const result = await this._pool.query(query);
        
        if(!result.rows.length){
            throw new NotFoundError('Song tidak ditemukan');
        }

        return result.rows.map(mapDBToModel)[0];

    }

    async editSongById(id, {title, year, genre, performer, duration, albumId}){
        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6, updated_at = $7 WHERE id = $8 RETURNING *',
            values: [title, year, genre, performer, duration, albumId, updatedAt, id],
        }

        const result = await this._pool.query(query)
        
        if(!result.rows.length){
            throw new NotFoundError('Gagal memperbarui songs. Id tidak ditemukan');
        }
        return result.rows.map(mapDBToModel)[0];
    }

    async deleteSongById(id){
        const query = {
            text: 'DELETE from songs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan')
        }
    }
}

module.exports = SongsService