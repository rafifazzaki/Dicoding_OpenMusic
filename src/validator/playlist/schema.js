const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string(),
});

const SongToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string(),
});

module.exports = { PlaylistPayloadSchema, SongToPlaylistPayloadSchema };
