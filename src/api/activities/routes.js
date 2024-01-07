const routes = (handler) => [
    {
        method: 'GET',
        path: '/playlists/{id}/activities',
        handler: (request, h) => handler.getActivitiesFromPlaylistHandler(request, h),
        options: {
          auth: 'playlists_jwt'
        },
    },
]

module.exports = routes