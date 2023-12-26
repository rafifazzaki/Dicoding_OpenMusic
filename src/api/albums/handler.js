class AlbumsHandler{
    constructor(service){
        this._service = service;
    }

    async postAlbumHandler(request, h){
        const { name, year } = request.payload;

        const albumId = await this._service.addAlbum({name, year})
        const response = h.response({
            status: 'status',
            message: 'Album berhasil ditambahkan',
            data: {
                albumId,
            }
        })
        response.code(201)
        return response
    }

    async getAlbumsHandler(){
        const albums = await this._service.getAlbums();
        return{
            status: 'success',
            data: {
                albums
            }
        }
    }

    async getAlbumByIdHandler(request, h){
        const { id } = request.params;
        const album = await this._service.getAlbumById(id);
        return{
            status: 'success',
            data:{
                album
            }
        }
    }

    async putAlbumByIdHandler(request, h){
        const { id } = request.params;
        this._service.editAlbumById(id, request.payload);
        return {
            status: 'success',
            message: 'berhasil diperbarui'
        }
    }

    async deleteAlbumByIdHandler(request, h){
        const {id} = request.params
        this._service.deleteAlbumById(id)
        return{
            status: 'success',
            message: 'berhasil dihapus'
        }
    }
}

module.exports = AlbumsHandler