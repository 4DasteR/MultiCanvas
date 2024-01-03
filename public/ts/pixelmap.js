var Color;
(function (Color) {
    Color["BLACK"] = "#000";
    Color["WHITE"] = "#FFF";
    Color["GRAY"] = "#6A6C6E";
    Color["RED"] = "#FF0000";
    Color["YELLOW"] = "#FFFF00";
    Color["ORANGE"] = "#FFA500";
    Color["GREEN"] = "#00FF00";
    Color["DARK_GREEN"] = "#013C01";
    Color["SEA_GREEN"] = "#00F99C";
    Color["BLUE"] = "#0000FF";
    Color["NAVY"] = "#202A44";
    Color["CYAN"] = "#00BCE3";
    Color["PURPLE"] = "#FF00FF";
    Color["VIOLET"] = "#7F00FF";
    Color["MAGENTA"] = "#D9017A";
})(Color || (Color = {}));
var getColorKey = function (colorCode) {
    for (var colorKey in Color)
        if (colorCode === Color[colorKey])
            return colorKey;
    return "";
};
var Pixel = /** @class */ (function () {
    function Pixel(x, y, color, placedBy, lastModified) {
        if (placedBy === void 0) { placedBy = 'admin'; }
        if (lastModified === void 0) { lastModified = new Date(Date.now()); }
        this.x = x;
        this.y = y;
        this.color = color;
        this.placedBy = placedBy;
        this.lastModified = lastModified;
    }
    Pixel.fromJSON = function (json) {
        var x = json.x, y = json.y, color = json.color, placedBy = json.placedBy, lastModified = json.lastModified;
        return new Pixel(x, y, color, placedBy, new Date(lastModified));
    };
    return Pixel;
}());
