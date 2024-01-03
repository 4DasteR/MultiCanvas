const {User} = require('./models');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(12);

/**
 * Class responsible for handling all events related do Users.
 */
class UserLogger {

    /**
     * Method used to perform validation of user for login.
     * @param username username of user attempting log in.
     * @param password password of user attempting log in.
     * @returns {Promise<*|boolean>} true if provided password matches one for given username id db, false otherwise and when user for given username doesn't exist.
     */
    login = async (username, password) => {
        const user = await User.findUser(username);
        if (!user) return false;
        return bcrypt.compareSync(password, user.password);
    }


    /**
     * Method used to register a new user.
     * @param username username of new user.
     * @param password password of new user.
     * @returns {Promise<boolean>} true if user was registered, false otherwise.
     */
    register = async (username, password) => {
        return User.createUser(username, bcrypt.hashSync(password, salt));
    }
}

module.exports = new UserLogger();