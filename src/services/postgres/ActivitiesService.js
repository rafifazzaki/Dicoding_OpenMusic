/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async getActivities(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, activities.action, activities.time
            FROM activities
            LEFT JOIN users ON activities.user_id = users.id 
            LEFT JOIN songs ON activities.song_id = songs.id
            WHERE playlist_id = $1
            GROUP BY activities.id, users.username, songs.title, activities.action, activities.time
            ORDER BY activities.time;`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Id playlist tidak ditemukan');
    }

    return result.rows;
  }
}

module.exports = ActivitiesService;
