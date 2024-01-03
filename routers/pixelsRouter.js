const express = require('express')
const PixelManager = require('../utility/pixels');
const WebSocket = require('ws');

const router = express.Router();
router.use(express.json());

router.post('/load', async (req, res) => {
    const pixels = await PixelManager.getAll();
    res.send(pixels);
});


/*router.post('/create', async (req, res) => {
    const data = req.body;
    const len = Math.sqrt(data.len);
    console.log(len);
    if (req.session.logged_in && req.session.username === 'admin') {
        for (let y = 0, i = 0; y < len; y++) {
            for (let x = 0; x < len; x++, i++) {
                console.log(`${i} : ${await PixelManager.createWhiteAdminPixel(x, y)}, ${x}:${y}`);
            }
        }
        res.send(`Created all`);
    } else if (req.session.logged_in) {
        res.send(`Sry ur not admin, but u are ${req.session.username}`);
    } else {
        res.send("Sry ur not logged in");
    }
});*/

module.exports = (wss) => {

    router.post('/change', async (req, res) => {
        const data = req.body;
        const pixel = data[0];
        const newColor = data[1];
        let updated = false;
        if (req.session.logged_in) {
            updated = await PixelManager.update(pixel, req.session.username, newColor);
            if (updated) {
                // Broadcast changes to all clients
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send('Canvas changed');
                    }
                });
            }
        }
        // console.log(data);
        res.send(updated);
    });

    return router;
}