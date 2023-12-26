class SongsHandler{
    constructor(service){
        this._service = service;
    }

    async postSongHandler(request, h){
        const { title, year, genre, performer, duration, albumId } = request.payload;

        const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId })
        const response = h.response({
            status: 'status',
            message: 'Song berhasil ditambahkan',
            data: {
                songId,
            },
        })
        response.code(201)
        return response
        // try catch
    }

    async getSongsHandler(){
        const songs = await this._service.getSongs();
        return{
            status: 'success',
            data: {
                songs
            }
        }
        // try catch
    }

    async getSongByIdHandler(request, h){
        const { id } = request.params;
        const song = await this._service.getSongById(id);
        return{
            status: 'success',
            data:{
                song
            }
        }

        // try catch
    }

    async putSongByIdHandler(request, h){
        const { id } = request.params;
        this._service.editSongById(id, request.payload);
        return {
            status: 'success',
            message: 'berhasil diperbarui'
        }
        // try catch
    }

    async deleteSongByIdHandler(request, h){
        const {id} = request.params
        this._service.deleteSongById(id)
        return{
            status: 'success',
            message: 'berhasil dihapus'
        }
    }
    // try catch
}

module.exports = SongsHandler;