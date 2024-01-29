/* eslint-disable no-underscore-dangle */
class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postCoverToAlbumByIdHandler.bind(this);
  }

  async postCoverToAlbumByIdHandler(request, h) {
    const { cover: data } = request.payload;
    this._validator.validateImageHeaders(data.hapi.headers);
    const { id } = request.params;
    const coverResponse = await this._service.writeFile(id, data, data.hapi);
    const response = h.response({
      status: 'success',
      message: 'berhasil mengupload cover album',
      data: {
        id,
        coverResponse: `http://${process.env.HOST}:${process.env.PORT}/albums/${id}/covers/${coverResponse}`,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
