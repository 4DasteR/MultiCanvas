const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const host = window.location.hostname;
const socket = new WebSocket(`ws://${host}:3000`);

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let WIDTH = canvas.width, HEIGHT = canvas.height;

const PIXEL_W = 64, PIXEL_H = PIXEL_W;

let gx = 0, gy = 0;

// @ts-ignore
const pixels: Pixel[] = [];

$(() => load());
$(socket).on('message', () => load());
$(window).on('resize', () => updateCanvasDimensions());

const load = () => {
    $.post('/pixel/load', pxs => {
        pixels.length = 0;
        // @ts-ignore
        for (let px of pxs) pixels.push(Pixel.fromJSON(px));
        render();
        pixelInfoFill(getPixelAtMousePosition(gx, gy));
    });
}

const updateCanvasDimensions = () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    render(); // Re-render the canvas after updating dimensions
};

const render = () => {
    pixels.forEach(pixel => {
        context.fillStyle = pixel.color;
        context.strokeStyle = context.fillStyle;
        context.lineWidth = 2;
        const pixelX = Math.round((pixel.x * WIDTH) / PIXEL_W);
        const pixelY = Math.round((pixel.y * HEIGHT) / PIXEL_H);
        const pixelWidth = Math.round(WIDTH / PIXEL_W);
        const pixelHeight = Math.round(HEIGHT / PIXEL_H);
        context.strokeRect(pixelX + 1, pixelY + 1, pixelWidth - 1, pixelHeight - 1);
        context.fillRect(pixelX, pixelY, pixelWidth, pixelHeight);
    });
}

const getPixelAtMousePosition = (x: number, y: number) => {
    let col = Math.floor(x / (WIDTH / PIXEL_W));
    let row = Math.floor(y / (HEIGHT / PIXEL_H));
    // @ts-ignore
    return pixels.find((pixel: Pixel) => pixel.y === row && pixel.x === col);
};

$(canvas).on('click', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pixel = getPixelAtMousePosition(x, y);
    if (pixel) {
        // @ts-ignore
        if (currentColorPicker) {
            $.ajax({
                type: "POST",
                url: "/pixel/change",
                contentType: "application/json",
                // @ts-ignore
                data: JSON.stringify([pixel, currentlyPickedColor]),
                success: data => {
                    if (data) socket.send('Canvas changed');
                },
            });
        }
    }
});

/*const cr = () => {
    $.post('/pixel/create', {len: pixels.length}, d => console.log(d))
}*/

const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
};

const dateFormatter = new Intl.DateTimeFormat('pl-PL', dateOptions);

// @ts-ignore
const pixelInfoFill = (pixel: Pixel) => {
    $('#info-position').text(`Position: (${pixel.x}, ${pixel.y})`);
    $('#info-color-box').css('background', `${pixel.color}`);
    // @ts-ignore
    $('#info-color-text').text(`${getColorKey(pixel.color).replace('_', ' ')}`);
    $('#info-user').text(`Placed by: ${pixel.placedBy}`);
    $('#info-date').text(`Last modified: ${dateFormatter.format(pixel.lastModified)}`);
}

$(canvas).on('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gx = x; //global mouseX track on canvas
    gy = y;  //global mouseY track on canvas

    const pixel = getPixelAtMousePosition(x, y);
    if (pixel) pixelInfoFill(pixel);
});

const pixelInfo = $('#pixel-info');
$(canvas).on('mouseenter', () => {
    if (pixelInfo.css('display') === 'none') {
        pixelInfo.css('opacity', 0).css('display', 'flex').animate({opacity: 1}, 'fast');
    } else {
        pixelInfo.stop().animate({opacity: 1}, 'fast');
    }
});

$(canvas).on('mouseleave', () => {
    pixelInfo.stop().animate({opacity: 0}, 'fast', function () {
        $(this).css('display', 'none');
    });
});