/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('albums', {
    coverUrl: {
      type: 'TEXT',
    },
  });

  pgm.sql('UPDATE albums SET "coverUrl" = NULL');
};

exports.down = (pgm) => {
  pgm.dropColumn('albums', 'coverUrl');
};
