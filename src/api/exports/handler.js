/* eslint-disable no-underscore-dangle */
class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postExportPlaylistsHandler(request, h) {
    await this._validator.validateExportPlaylistsPayload(request.payload);
    await this._service.checkPlaylistId(request.params, request.auth.credentials.id);

    const { playlistId } = request.params;

    const message = {
      userId: request.auth.credentials.id,
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}
module.exports = ExportsHandler;
