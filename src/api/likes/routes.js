const routes = (handler) => [
    {
      method: 'POST',
      path: '/albums/{id}/likes',
      handler: (request, h) => handler.addLikeToAlbumHandler(request, h),
      options: {
        auth: 'playlists_jwt',
      },
    },
    {
        method: 'DELETE',
        path: '/albums/{id}/likes',
        handler: (request, h) => handler.deleteLikeFromAlbumHandler(request, h),
        options: {
          auth: 'playlists_jwt',
        },
      },
      {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: (request, h) => handler.getLikeFromAlbumHandler(request, h),
      },
  ];
  
  module.exports = routes;
  