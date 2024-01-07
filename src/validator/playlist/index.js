const { PlaylistPayloadSchema, SongToPlaylistPayloadSchema } = require('./schema')
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistValidator = {
    validatePlaylistPayload: (payload) => {
        const validationResult = PlaylistPayloadSchema.validate(payload)
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateSongToPlaylistPayload: (payload) => {
        const validationResult = SongToPlaylistPayloadSchema.validate(payload)
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }
    }
}

module.exports = PlaylistValidator