/* eslint-disable no-underscore-dangle */
class LikesHandler {
  constructor(service) {
    this._service = service;
  }

  async addLikeToAlbumHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const albumId = await this._service.addLikeToAlbum(id, credentialId);

    const response = h.response({
      status: 'success',
      message: 'album berhasil di like!',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteLikeFromAlbumHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.deleteAlbumById(id, credentialId);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async getLikeFromAlbumHandler(request, h) {
    const { id } = request.params;
    const { count, cache } = await this._service.getAlbums(id);
    // eslint-disable-next-line radix
    const likes = parseInt(count);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    if (cache) response.header('X-Data-Source', 'cache');
    return response;
  }
}
module.exports = LikesHandler;
