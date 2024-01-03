const footer = $('footer');
const colorPickerBar = $('footer>#colors');

// @ts-ignore
let currentlyPickedColor = Color.WHITE;
let currentColorPicker = null;

colorPickerBar.html('');

const ColorPickerKey = {
    BLACK: {key: '0', keyCode: 48},
    WHITE: {key: '1', keyCode: 49},
    GRAY: {key: '2', keyCode: 50},
    RED: {key: '3', keyCode: 51},
    YELLOW: {key: '4', keyCode: 52},
    ORANGE: {key: '5', keyCode: 53},
    GREEN: {key: '6', keyCode: 54},
    DARK_GREEN: {key: '7', keyCode: 55},
    SEA_GREEN: {key: '8', keyCode: 56},
    BLUE: {key: '9', keyCode: 57},
    NAVY: {key: 'Q', keyCode: 81},
    CYAN: {key: 'W', keyCode: 87},
    PURPLE: {key: 'E', keyCode: 69},
    VIOLET: {key: 'R', keyCode: 82},
    MAGENTA: {key: 'T', keyCode: 84},
    NONE: {key: 'X', keyCode: 88}
}

// @ts-ignore
for (let colorKey in Color) {
    colorPickerBar.append(`<div id="${colorKey}" class="color-tile"></div>`)
    const colorPickerElement = $(`#colors > #${colorKey}`);
    // @ts-ignore
    colorPickerElement.css('background', `${Color[colorKey]}`);
    colorPickerElement.text(ColorPickerKey[colorKey].key);
}

colorPickerBar.append(`<div id="NONE" class="color-tile"></div>`)
$('#colors > #NONE').html('<img src="/resources/x.svg" alt="X">');

const colorPickers = colorPickerBar.children();

const pickColorEvent = (id: string) => {
    if (id === 'NONE') {
        // @ts-ignore
        currentlyPickedColor = Color.WHITE;
        $(currentColorPicker).css('outline', 'none');
        currentColorPicker = null;
    } else {
        // @ts-ignore
        currentlyPickedColor = Color[id];
        $(currentColorPicker).css('outline', 'none');
        currentColorPicker = $(`#${id}`);
        $(currentColorPicker).css('outline', '3.25px solid black');
    }
}

// @ts-ignore
for (const colorPicker of colorPickers) {
    const id = colorPicker.id;
    $(colorPicker).on('click', () => {
        pickColorEvent(id);
    });

    $(document).on('keydown', (event) => {
        const keyCode = event.which;
        if (ColorPickerKey[id].keyCode === keyCode) pickColorEvent(id);
    });
}