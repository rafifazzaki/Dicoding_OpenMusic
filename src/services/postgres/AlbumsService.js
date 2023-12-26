const { nanoid } = require('nanoid');
const { Pool } = require('pg')

class AlbumsService{
    constructor(){
        this._pool = new Pool()
    }

    async addAlbum({name, year}){
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, name, year, createdAt, updatedAt]
        }

        const result = await this._pool.query(query)

        if(!result.rows[0].id){
            throw Error('gagal ditambahkan')
        }

        return result.rows[0].id
    }

    async getAlbums(){
        const result = await this._pool.query('SELECT * FROM albums');
        return result;
    }

    async getAlbumById(id){
        const query = {
            text: 'SELECT * from albums WHERE id = $1',
            values: [id],
        }

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new Error('albums tidak ditemukan');
        }

        // return result.rows.map(mapDBToModel)[0];
        return result.rows[0];
    }

    async editAlbumById(id, {name, year}){
        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
            values: [name, year, updatedAt, id],
        }

        const result = await this._pool.query(query)

        if(!result.rows.length){
            throw new Error('Gagal memperbarui songs. Id tidak ditemukan');
        }
    }

    async deleteAlbumById(id){
        const query = {
            text: 'DELETE from albums WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new Error('Catatan gagal dihapus. Id tidak ditemukan')
        }
    }
}

module.exports = AlbumsService