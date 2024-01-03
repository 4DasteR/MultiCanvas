const redis = require('redis');

const client = redis.createClient();
client.connect().then(() => console.log('Connected to Redis')).catch(e => console.log(e));

/**
 * Function returning JSON for given object stored in redis database.
 * @param key unique identifier of desired object in database.
 * @returns {Promise<any>} JSON of desired object.
 */
const find = async key => {
    const res = await client.get(key);
    return JSON.parse(res);
}

/**
 * Model of User object inside Redis database.
 */
class User {

    /**
     * Static method creating a new user.
     * @param username username of new user.
     * @param password encrypted password of new user.
     * @returns {Promise<boolean>} true if new user has been created, otherwise false.
     */
    static createUser = async (username, password) => {
        const user = {
            username: username,
            password: password
        };

        const foundUser = await this.findUser(username);

        if (foundUser) {
            console.log(`Cannot create new user ${username}, already exists`);
            return false;
        }

        await client.set(`user:${username}`, JSON.stringify(user));
        await client.save();

        console.log(`User ${username} created.`)
        return true;
    }

    /**
     * Static method returning JSON of user for given username.
     * @param username
     * @returns {Promise<*>} JSON of user or null.
     */
    static findUser = async (username) => {
        return find(`user:${username}`);
    }
}

/**
 *
 */
class Pixel {

    /**
     * Static method designed to fill Redis DB with pixels.
     * @param x x coordinate of pixel.
     * @param y y coordinate of pixel.
     * @param color color of pixel.
     * @param placedBy username of user placing the pixel.
     * @param lastModified date when pixel was last modified. If not specified filled with current date.
     * @returns {Promise<boolean>} True if pixel was created, false otherwise.
     */
    static createPixel = async (x, y, color, placedBy, lastModified) => {
        if (lastModified === void 0) lastModified = new Date(Date.now()).toISOString();

        const pixel = {
            x: x,
            y: y,
            color: color,
            placedBy: placedBy,
            lastModified: lastModified
        }

        const foundUser = await User.findUser(placedBy);

        if (!foundUser) {
            console.log(`User ${placedBy} doesn't exist!`);
            return false;
        }

        const foundPixel = await Pixel.findPixel(x, y);

        if (foundPixel) {
            console.log(`Pixel at position (${x},${y}) already exists`);
            return false;
        }

        await client.set(`pixel:${x}:${y}`, JSON.stringify(pixel));
        // await client.save();

        return true;
    }

    /**
     * Static method returning JSON of pixel in given coordinates.
     * @param x x coordinate of pixel.
     * @param y y coordinate of pixel.
     * @returns {Promise<*>} JSON of pixel or null.
     */
    static findPixel = async (x, y) => {
        return find(`pixel:${x}:${y}`);
    }

    /**
     * Static method returning list of all pixels in Redis DB as JSON objects.
     * @returns {Promise<Awaited<unknown>[]>} List of JSON objects representing pixels.
     */
    static findAll = async () => {
        const keys = await client.keys('pixel*');
        const pixelPromises = keys.sort().map(key => find(key));
        return await Promise.all(pixelPromises);
    }

    /**
     * Static method for changing the state of the pixel.
     * @param x x coordinate of pixel.
     * @param y y coordinate of pixel.
     * @param color new color of pixel.
     * @param placedBy username of user changing the pixel.
     * @returns {Promise<boolean>} True if pixel's state was changed, otherwise false.
     */
    static updatePixel = async (x, y, color, placedBy) => {
        const exists = await Pixel.findPixel(x, y);
        if (!exists) return false;

        const pixel = {
            x: x,
            y: y,
            color: color,
            placedBy: placedBy,
            lastModified: new Date(Date.now()).toISOString()
        }

        await client.set(`pixel:${x}:${y}`, JSON.stringify(pixel));
        await client.save();
        return true;
    }

}

module.exports = {
    User: User,
    Pixel: Pixel
}