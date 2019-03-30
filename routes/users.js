/**
 * We just pass our add controller to our router.
 * This will be triggered when we make a POST request to the /users route.
 */
const controller = require('../controllers/users');

module.exports = (router) => {
    router.route('/users').post(controller.add);
};