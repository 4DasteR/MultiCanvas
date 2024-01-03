enum Color {
    BLACK = '#000',
    WHITE = '#FFF',
    GRAY = '#6A6C6E',
    RED = '#FF0000',
    YELLOW = '#FFFF00',
    ORANGE = '#FFA500',
    GREEN = '#00FF00',
    DARK_GREEN = '#013C01',
    SEA_GREEN = '#00F99C',
    BLUE = '#0000FF',
    NAVY = '#202A44',
    CYAN = '#00BCE3',
    PURPLE = '#FF00FF',
    VIOLET = '#7F00FF',
    MAGENTA = '#D9017A'
}

const getColorKey = (colorCode: string) => {
    for (let colorKey in Color) if (colorCode === Color[colorKey]) return colorKey;
    return "";
}

class Pixel {
    public x: number;
    public y: number;
    public color: Color;
    public placedBy: String;
    public lastModified: Date;

    constructor(x: number, y: number, color: Color, placedBy: string = 'admin', lastModified: Date = new Date(Date.now())) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.placedBy = placedBy;
        this.lastModified = lastModified;
    }

    static fromJSON(json: any): Pixel {
        const {x, y, color, placedBy, lastModified} = json;
        return new Pixel(x, y, color, placedBy, new Date(lastModified));
    }

}