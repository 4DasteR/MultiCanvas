const {Pixel} = require('./models');

/**
 * Class responsible for handling all events related do Pixels.
 */
class PixelManager {

    /*createWhiteAdminPixel = async (x, y) => {
        return Pixel.createPixel(x, y, '#FFF', 'admin', new Date(Date.now()).toISOString());
    }*/

    /**
     * Method performing update on the state of given pixel.
     * @param pixel updating pixel.
     * @param loggedUser user altering the pixel.
     * @param newColor new color for pixel
     * @returns {Promise<boolean>} true if pixel was updated, false otherwise.
     */
    update = async (pixel, loggedUser, newColor) => {
        const {x, y} = pixel;
        return Pixel.updatePixel(x, y, newColor, loggedUser);
    }

    /**
     * Method returning all Pixels inside DB.
     * @returns {Promise<Awaited<*>[]>} list of all pixels in JSON form.
     */
    getAll = async () => {
        return Pixel.findAll();
    }

}

module.exports = new PixelManager();