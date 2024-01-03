var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
var host = window.location.hostname;
var socket = new WebSocket("ws://".concat(host, ":3000"));
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var WIDTH = canvas.width, HEIGHT = canvas.height;
var PIXEL_W = 64, PIXEL_H = PIXEL_W;
var gx = 0, gy = 0;
// @ts-ignore
var pixels = [];
$(function () { return load(); });
$(socket).on('message', function () { return load(); });
$(window).on('resize', function () { return updateCanvasDimensions(); });
var load = function () {
    $.post('/pixel/load', function (pxs) {
        pixels.length = 0;
        // @ts-ignore
        for (var _i = 0, pxs_1 = pxs; _i < pxs_1.length; _i++) {
            var px = pxs_1[_i];
            pixels.push(Pixel.fromJSON(px));
        }
        render();
        pixelInfoFill(getPixelAtMousePosition(gx, gy));
    });
};
var updateCanvasDimensions = function () {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    render(); // Re-render the canvas after updating dimensions
};
var render = function () {
    pixels.forEach(function (pixel) {
        context.fillStyle = pixel.color;
        context.strokeStyle = context.fillStyle;
        context.lineWidth = 2;
        var pixelX = Math.round((pixel.x * WIDTH) / PIXEL_W);
        var pixelY = Math.round((pixel.y * HEIGHT) / PIXEL_H);
        var pixelWidth = Math.round(WIDTH / PIXEL_W);
        var pixelHeight = Math.round(HEIGHT / PIXEL_H);
        context.strokeRect(pixelX + 1, pixelY + 1, pixelWidth - 1, pixelHeight - 1);
        context.fillRect(pixelX, pixelY, pixelWidth, pixelHeight);
    });
};
var getPixelAtMousePosition = function (x, y) {
    var col = Math.floor(x / (WIDTH / PIXEL_W));
    var row = Math.floor(y / (HEIGHT / PIXEL_H));
    // @ts-ignore
    return pixels.find(function (pixel) { return pixel.y === row && pixel.x === col; });
};
$(canvas).on('click', function (e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var pixel = getPixelAtMousePosition(x, y);
    if (pixel) {
        // @ts-ignore
        if (currentColorPicker) {
            $.ajax({
                type: "POST",
                url: "/pixel/change",
                contentType: "application/json",
                // @ts-ignore
                data: JSON.stringify([pixel, currentlyPickedColor]),
                success: function (data) {
                    if (data)
                        socket.send('Canvas changed');
                },
            });
        }
    }
});
/*const cr = () => {
    $.post('/pixel/create', {len: pixels.length}, d => console.log(d))
}*/
var dateOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
};
var dateFormatter = new Intl.DateTimeFormat('pl-PL', dateOptions);
// @ts-ignore
var pixelInfoFill = function (pixel) {
    $('#info-position').text("Position: (".concat(pixel.x, ", ").concat(pixel.y, ")"));
    $('#info-color-box').css('background', "".concat(pixel.color));
    // @ts-ignore
    $('#info-color-text').text("".concat(getColorKey(pixel.color).replace('_', ' ')));
    $('#info-user').text("Placed by: ".concat(pixel.placedBy));
    $('#info-date').text("Last modified: ".concat(dateFormatter.format(pixel.lastModified)));
};
$(canvas).on('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    gx = x; //global mouseX track on canvas
    gy = y; //global mouseY track on canvas
    var pixel = getPixelAtMousePosition(x, y);
    if (pixel)
        pixelInfoFill(pixel);
});
var pixelInfo = $('#pixel-info');
$(canvas).on('mouseenter', function () {
    if (pixelInfo.css('display') === 'none') {
        pixelInfo.css('opacity', 0).css('display', 'flex').animate({ opacity: 1 }, 'fast');
    }
    else {
        pixelInfo.stop().animate({ opacity: 1 }, 'fast');
    }
});
$(canvas).on('mouseleave', function () {
    pixelInfo.stop().animate({ opacity: 0 }, 'fast', function () {
        $(this).css('display', 'none');
    });
});
