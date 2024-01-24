/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('user_album_likes', {
        id:{
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        user_id:{
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users(id)'
        },
        album_id:{
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'albums(id)'
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('user_album_likes')
};
