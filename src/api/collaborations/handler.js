/* eslint-disable no-underscore-dangle */
class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async addCollaborationHandler(request, h) {
    await this._validator.validateCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistsAccess(playlistId, credentialId);

    // eslint-disable-next-line max-len
    const collaborationId = await this._collaborationsService.addCollaboration({ playlistId, userId });
    const response = h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistsOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);
    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
