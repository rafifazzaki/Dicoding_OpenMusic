const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: (request, h) => handler.postCoverToAlbumByIdHandler(request, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/covers/{params*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../../../media'),
      },
    },
  },
];

module.exports = routes;
