const errors = require('@feathersjs/errors');
const logger = require('winston');

/* Ensure that the given UUID matches the UUID inside of the JWT
 */
module.exports = function(context) {
  if (!context.data.uuid) {
    logger.error('Receiving a request without a valid UUID', context.data);
    throw new errors.BadRequest('Invalid UUID');
  }

  if (context.data.uuid != context.params.payload.uuid) {
    logger.error('Receiving a request with to modify a UUID not matching the token (%s/%s)',
      context.data.uuid,
      context.params.payload.uuid);
    throw new errors.NotAuthenticated('Invalid UUID');
  }

  return context;
};
