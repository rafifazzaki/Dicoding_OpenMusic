const ActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'activities',
  version: '1.0.0',
  register: async (server, { activitiesService, playlistsService, validator }) => {
    const activitiesHandler = new ActivitiesHandler(activitiesService, playlistsService, validator);
    server.route(routes(activitiesHandler));
  },
};
