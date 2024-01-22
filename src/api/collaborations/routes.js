const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => handler.addCollaborationHandler(request, h),
    options: {
      auth: 'playlists_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request, h) => handler.deleteCollaborationHandler(request, h),
    options: {
      auth: 'playlists_jwt',
    },
  },
];

module.exports = routes;
