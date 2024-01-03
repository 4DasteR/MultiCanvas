var footer = $('footer');
var colorPickerBar = $('footer>#colors');
// @ts-ignore
var currentlyPickedColor = Color.WHITE;
var currentColorPicker = null;
colorPickerBar.html('');
var ColorPickerKey = {
    BLACK: { key: '0', keyCode: 48 },
    WHITE: { key: '1', keyCode: 49 },
    GRAY: { key: '2', keyCode: 50 },
    RED: { key: '3', keyCode: 51 },
    YELLOW: { key: '4', keyCode: 52 },
    ORANGE: { key: '5', keyCode: 53 },
    GREEN: { key: '6', keyCode: 54 },
    DARK_GREEN: { key: '7', keyCode: 55 },
    SEA_GREEN: { key: '8', keyCode: 56 },
    BLUE: { key: '9', keyCode: 57 },
    NAVY: { key: 'Q', keyCode: 81 },
    CYAN: { key: 'W', keyCode: 87 },
    PURPLE: { key: 'E', keyCode: 69 },
    VIOLET: { key: 'R', keyCode: 82 },
    MAGENTA: { key: 'T', keyCode: 84 },
    NONE: { key: 'X', keyCode: 88 }
};
// @ts-ignore
for (var colorKey in Color) {
    colorPickerBar.append("<div id=\"".concat(colorKey, "\" class=\"color-tile\"></div>"));
    var colorPickerElement = $("#colors > #".concat(colorKey));
    // @ts-ignore
    colorPickerElement.css('background', "".concat(Color[colorKey]));
    colorPickerElement.text(ColorPickerKey[colorKey].key);
}
colorPickerBar.append("<div id=\"NONE\" class=\"color-tile\"></div>");
$('#colors > #NONE').html('<img src="/resources/x.svg" alt="X">');
var colorPickers = colorPickerBar.children();
var pickColorEvent = function (id) {
    if (id === 'NONE') {
        // @ts-ignore
        currentlyPickedColor = Color.WHITE;
        $(currentColorPicker).css('outline', 'none');
        currentColorPicker = null;
    }
    else {
        // @ts-ignore
        currentlyPickedColor = Color[id];
        $(currentColorPicker).css('outline', 'none');
        currentColorPicker = $("#".concat(id));
        $(currentColorPicker).css('outline', '3.25px solid black');
    }
};
var _loop_1 = function (colorPicker) {
    var id = colorPicker.id;
    $(colorPicker).on('click', function () {
        pickColorEvent(id);
    });
    $(document).on('keydown', function (event) {
        var keyCode = event.which;
        if (ColorPickerKey[id].keyCode === keyCode)
            pickColorEvent(id);
    });
};
// @ts-ignore
for (var _i = 0, colorPickers_1 = colorPickers; _i < colorPickers_1.length; _i++) {
    var colorPicker = colorPickers_1[_i];
    _loop_1(colorPicker);
}
