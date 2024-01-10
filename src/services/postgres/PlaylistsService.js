const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapDBToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
    constructor(collaborationsService){
        this._pool = new Pool();
        this._collaborationsService = collaborationsService
    }

    async AddToActivities(playlistId, credentialId, songId, action){
      const id = `activities-${nanoid(16)}`;
      const time = new Date().toISOString();
      
      const query = {
        text: "INSERT INTO activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id;",
        values: [id, playlistId, credentialId, songId, action, time],
      };
      const result = await this._pool.query(query);
      
  }
    
    async addPlaylist({ name, credentialId }) {
        const id = `playlist-${nanoid(16)}`;
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        
        const query = {
          text: "INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id",
          values: [id, name, credentialId, createdAt, updatedAt],
        };
        
        const result = await this._pool.query(query);
        
        if (!result.rows[0].id) {
          throw InvariantError('Playlist gagal ditambahkan');
        }
        
        return result.rows[0].id;
      }

      async getPlaylists(owner) {
        
        const query = {
            text: `SELECT 
                      playlists.id, 
                      playlists.name, 
                      users.username
                  FROM playlists
                  LEFT JOIN users ON playlists.owner = users.id
                  LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
                  WHERE playlists.owner = $1 OR collaborations.user_id = $1
                  GROUP BY playlists.id, users.username;`,
            values: [owner]
        };
          
        const result = await this._pool.query(query);
        return result.rows;
        
      }

      async addSongToPlaylist(playlistId,songId, credentialId){
        const id = `playlist_song_junction-${nanoid(16)}`;
        console.log(playlistId,songId, credentialId);

        const querySongIdCheck = {
          text: `SELECT * FROM songs WHERE id = $1`,
          values: [songId]
        }

        const songIdCheckresult = await this._pool.query(querySongIdCheck);

        if (!songIdCheckresult.rows.length) {
          throw new NotFoundError('Gagal menambah songs. Id song tidak ditemukan');
        }

        const query = {
          text: `INSERT INTO playlist_song_junction VALUES($1, $2, $3) RETURNING id;`,
          values: [id, playlistId, songId]
        }
        const result = await this._pool.query(query);
        
        if (!result.rows.length) {
          throw new NotFoundError('Gagal menambah songs. Id playlist tidak ditemukan');
        }

        await this.AddToActivities(playlistId, credentialId, songId, 'add')

        return result.rows.map(mapDBToModel)[0];
      }


      async verifyPlaylistsOwner(id, owner){
        
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1;',
            values: [id]
        }
        
        const result = await this._pool.query(query)
        
        if(!result.rows.length){
            throw new NotFoundError('Playlist tidak ditemukan')
        }
        
        const playlist = result.rows[0]
        
        if(playlist.owner != owner){
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
        }
        
    }

    async verifyPlaylistsAccess(playlistId, userId){
        try {
          
            await this.verifyPlaylistsOwner(playlistId, userId)
        } catch (error) {
            if(error instanceof NotFoundError){
                throw error
            }
            try {
                await this._collaborationsService.verifyCollaborator(playlistId, userId)
            } catch{
                throw error
            }
        }
    }

    async getSongFromPlaylist({ id }){
      const query = {
        text: `SELECT playlists.id, playlists.name, users.username,
        jsonb_agg(
            jsonb_build_object(
                'id', songs.id,
                'title', songs.title,
                'performer', songs.performer
            )
        ) AS songs
        FROM playlists
        JOIN playlist_song_junction psj ON playlists.id = psj.playlist_id
        JOIN songs ON songs.id = psj.song_id
        JOIN users ON users.id = playlists.owner
        WHERE playlists.id = $1
        GROUP BY playlists.id, users.username;`,
        values: [id]
    };
      
    const result = await this._pool.query(query);
    return result.rows[0];
    }


    async deleteSongFromPlaylistById(songId, id, credentialId){
      const query = {
        text: `DELETE FROM playlist_song_junction WHERE song_id = $1 AND playlist_id = $2 RETURNING id;`,
        values: [songId, id],
    };

      const result = await this._pool.query(query);

      if(!result.rows.length){
          throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan')
      }
      
      await this.AddToActivities(id, credentialId, songId, 'delete')
      // await AddToActivities(playlistId, credentialId, songId, 'delete')

    }

    async deletePlaylistById(id){
      
      const deleteFkConstraintActivities = {
        text: 'DELETE FROM activities WHERE playlist_id = $1;',
        values: [id]
      }

      await this._pool.query(deleteFkConstraintActivities);

      const query = {
        text: 'DELETE from playlists WHERE id = $1 RETURNING id;',
        values: [id],
      };

      const result = await this._pool.query(query);

      if(!result.rows.length){
          throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan')
      }
    }

    


      
}

module.exports = PlaylistsService