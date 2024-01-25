/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class LikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLikeToAlbum(albumId, userId) {
    const id = `like-${nanoid(16)}`;

    const likeCheckQuery = {
      text: 'SELECT id FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const likeCheckResult = await this._pool.query(likeCheckQuery);

    if (likeCheckResult.rows.length) {
      throw new InvariantError('album sudah di like');
    }

    const albumCheckQuery = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };

    const albumCheckResult = await this._pool.query(albumCheckQuery);

    if (!albumCheckResult.rows.length) {
      throw new NotFoundError('albumId tidak ditemukan');
    }
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id;',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw InvariantError('Like gagal ditambahkan');
    }

    await this._cacheService.delete(`musicapi:${albumId}`);

    return result.rows[0];
  }

  async deleteAlbumById(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Like gagal dihapus');
    }

    await this._cacheService.delete(`musicapi:${albumId}`);
  }

  async getAlbums(albumId) {
    try {
      let result = await this._cacheService.get(`musicapi:${albumId}`);

      result = JSON.parse(result);
      result.cache = true;

      return result;
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(DISTINCT user_id) FROM user_album_likes WHERE album_id = $1;',
        values: [albumId],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(`musicapi:${albumId}`, JSON.stringify(result.rows[0]));

      return result.rows[0];
    }
  }
}
module.exports = LikesService;
