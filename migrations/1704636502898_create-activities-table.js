/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'playlists(id)',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'songs(id)',
    },
    action: {
      type: 'TEXT',
      notNull: true,
    },
    time: {
      type: 'TEXT',
      notNull: true,
    },

  });
};

exports.down = (pgm) => {
  pgm.dropTable('activities');
};
