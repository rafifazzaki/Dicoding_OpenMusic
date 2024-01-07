class PlaylistsHandler{
    constructor(service, validator){
        this._service = service
        this._validator = validator
    }

    async postPlaylistHandler(request, h){
        this._validator.validatePlaylistPayload(request.payload);
        const { name } = request.payload;
        // const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        // await this._service.verifyPlaylistsOwner(id, credentialId)

        const playlistId = await this._service.addPlaylist({ name, credentialId });
        const response = h.response({
        status: 'success',
        data: {
            playlistId,
        },
        });
        response.code(201);
        return response;
    }

    async getPlaylistsHandler(request, h){

        // const { id: credentialId } = request.auth.credentials;

        const playlists = await this._service.getPlaylists();
        return {
          status: 'success',
          data: {
            playlists,
          },
        };
    }

    async deletePlaylistByIdHandler(request, h){
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials

        await this._service.verifyPlaylistsOwner(id, credentialId)
        await this._service.deletePlaylistById(id);
            return{
                status: 'success',
                message: 'Catatan berhasil dihapus'
            }
    }

    async postSongToPlaylistHandler(request, h){
        this._validator.validateSongToPlaylistPayload(request.payload);
        const { songId } = request.payload;
        const { id } = request.params;

        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistsOwner(id, credentialId)

        await this._service.addSongToPlaylist({id, songId});
        const response = h.response({
        status: 'success',
        message: 'Song berhasil disimpan pada playlist',
        
        });
        response.code(201);
        return response;
    }

    async getSongFromPlaylistHandler(request, h){
        this._validator.validateSongToPlaylistPayload(request.payload);
        
        const { id } = request.params;

        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistsOwner(id, credentialId)

        const playlist = await this._service.getSongFromPlaylist({ id });
        const response = h.response({
        status: 'success',
        data: {
            playlist,
          },
        
        });
        response.code(200);
        return response;
    }

    async deleteSongFromPlaylistHandler(request, h){
        const { songId } = request.payload;
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials

        this._validator.validateSongToPlaylistPayload(request.payload);
        await this._service.verifyPlaylistsOwner(id, credentialId)
        await this._service.deleteSongFromPlaylistById(songId, id);
            return{
                status: 'success',
                message: 'Song berhasil dihapus dari playlist'
            }
    }
}

module.exports = PlaylistsHandler