class ActivitiesHandler{
    constructor(activitiesService, playlistsService, validator){
        this._activitiesService = activitiesService
        this._playlistsService = playlistsService
        this._validator = validator
    }

    async getActivitiesFromPlaylistHandler(request, h){
        
        const { id: playlistId } = request.params
        const { id: credentialId } = request.auth.credentials;
        
        await this._playlistsService.verifyPlaylistsOwner(playlistId, credentialId)
        const activities = await this._activitiesService.getActivities(playlistId, credentialId);
        return {
          status: 'success',
          data: {
            playlistId,
            activities,
          },
        };
    }
}

module.exports = ActivitiesHandler