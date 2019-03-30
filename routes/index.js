/**
 * We just pass our main router from our index.js file to the users router in routes/users.js.
 * This will handle all functionality related to our users.
 */
const users = require('./users');

module.exports = (router) => {
    users(router);
    return router;
}