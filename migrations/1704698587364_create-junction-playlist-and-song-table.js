/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('playlist_song_junction', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'playlists(id)',
            onDelete: 'CASCADE',
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'songs(id)',
            onDelete: 'CASCADE',
        }
    })

    pgm.addConstraint('playlist_song_junction', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, song_id)')
};

exports.down = pgm => {
    pgm.dropTable('playlist_song_junction')
};
