/* eslint-disable camelcase */
// add foreign key to songs.albumId
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint('songs', 'fk_songs.albumid_albums.id', 'FOREIGN KEY("albumId") REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.albumid_albums.id');
};
