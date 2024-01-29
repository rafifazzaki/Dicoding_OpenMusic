/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class StorageService {
  constructor(folder) {
    this._folder = folder;
    this._pool = new Pool();

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  async writeFile(id, file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const url = `http://${process.env.HOST}:${process.env.PORT}/albums/${id}/covers/${filename}`;

    const query = {
      text: 'UPDATE albums SET "coverUrl"=$1 WHERE id=$2',
      values: [url, id],
    };

    try {
      await this._pool.query(query);
    } catch (error) {
      throw new NotFoundError('Gagal mengupload album cover');
    }

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}
module.exports = StorageService;
