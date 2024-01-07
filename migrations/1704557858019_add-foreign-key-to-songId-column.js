/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {


    // pgm.sql(`INSERT INTO songs (id, title, year, genre, performer, duration, "albumId", created_at, updated_at)
    // VALUES ('song_placeholder', 'song_placeholder', 2024, 'song_placeholder', 'song_placeholder', 0, 'song_placeholder', 'song_placeholder', current_timestamp);`);

    // pgm.sql(`UPDATE playlists
    // SET "songId" = 'song_placeholder'
    // WHERE "songId" IS NULL;`);

    // pgm.addConstraint('playlists', 'fk_playlists.songid_songs.id', 'FOREIGN KEY("songId") REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    // pgm.dropConstraint('playlists', 'fk_playlists.songid_songs.id');

    // pgm.sql(`UPDATE playlists SET "songId" = NULL WHERE "songId" = 'song_placeholder';`)

    // pgm.sql("DELETE FROM songs WHERE id = 'song_placeholder'")
};
