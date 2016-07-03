/* Version 0.10 */
(function() {
    //todo: remove elements
    function Aquamarine(arg) {
        this.data = format(arg) ? merge({
            color: arg
        }, settings()) : merge(arg, settings());
        this.data.input = iterateQuerySelectorAll(this.data.input);
        this.data.track = iterateQuerySelectorAll(this.data.track);
        this.data.preview = iterateQuerySelectorAll(this.data.preview);
        this.color = color;
        this.color(this.data.color);
        iterateElements(this.data.input, addEventListener, "input change", input, this);
        iterateElements(this.data.input, addEventListener, "focusout", function(self, element) {
            output(self);
        }, this);
        iterateElements(this.data.input.range, addEventListener, "click change", function(self, element) {
            element.focus();
        }, false);
        iterateElements(this.data.input.text, addEventListener, "keydown", arrowControl, false);
    }
    // todo: pass object to iterateElements
    function arrowControl(temp, element, event) {
        var value = parseFloat(element.value);
        var min = parseFloat(element.getAttribute("min"));
        var max = parseFloat(element.getAttribute("max"));
        var change = new Event("change");
        switch (event.which) {
          case 37:
            // left
            if (element.selectionStart === 0 && value > min) {
                element.value = value - 1;
                element.dispatchEvent(change);
                element.selectionStart = 0;
            }
            break;

          case 38:
            // up
            if (element.selectionStart === 0 && value < max) {
                element.value = value + 1;
                element.dispatchEvent(change);
                element.selectionStart = 0;
            }
            break;

          case 39:
            // right
            if (element.value.length === element.selectionEnd && value < max) {
                element.value = value + 1;
                element.dispatchEvent(change);
                element.selectionEnd = element.value.length;
            }
            break;

          case 40:
            // down
            if (element.value.length === element.selectionEnd && value > min) {
                element.value = value - 1;
                element.dispatchEvent(change);
                element.selectionEnd = element.value.length;
            }
            break;

          default:
            return;
        }
    }
    function color(color) {
        if (format(color)) {
            this.data.color = color;
            sync(this);
            output(this);
        }
        return this.data.color;
    }
    function sync(self) {
        // todo: sync h in hsl and hsv
        self.hex = tinycolor(self.data.color).toHexString();
        self.rgb = tinycolor(self.data.color).setAlpha(1).toRgbString();
        self.hsv = isHsv(self.data.color) ? self.data.color : tinycolor(self.data.color).setAlpha(1).toHsvString();
        self.hsl = isHsl(self.data.color) ? self.data.color : tinycolor(self.data.color).setAlpha(1).toHslString();
        self.data.gradient.rgb.r = gradient("rgb(0," + g(self.rgb) + "," + b(self.rgb) + ")", "rgb(255," + g(self.rgb) + "," + b(self.rgb) + ")");
        self.data.gradient.rgb.g = gradient("rgb(" + r(self.rgb) + ", 0," + b(self.rgb) + ")", "rgb(" + r(self.rgb) + ", 255," + b(self.rgb) + ")");
        self.data.gradient.rgb.b = gradient("rgb(" + r(self.rgb) + "," + g(self.rgb) + ", 0)", "rgb(" + r(self.rgb) + "," + g(self.rgb) + ", 255)");
        self.data.gradient.hsv.s = gradient("hsv(" + h(self.hsv) + ", 0%," + v(self.hsv) + "%)", "hsv(" + h(self.hsv) + ", 100%," + v(self.hsv) + "%)");
        self.data.gradient.hsv.v = gradient("hsv(" + h(self.hsv) + "," + s(self.hsv) + "%, 0%)", "hsv(" + h(self.hsv) + "," + s(self.hsv) + "%, 100%)");
        self.data.gradient.hsl.s = gradient("hsl(" + h(self.hsl) + ", 0%," + l(self.hsl) + "%)", "hsl(" + h(self.hsl) + ", 100%," + l(self.hsl) + "%)");
        self.data.gradient.hsl.l = gradient("hsl(" + h(self.hsl) + "," + s(self.hsl) + "%, 0%)", "hsl(" + h(self.hsl) + "," + s(self.hsl) + "%, 50%)", "hsl(" + h(self.hsl) + "," + s(self.hsl) + "%, 100%)");
        return true;
    }
    function output(self) {
        iterateElements(self.data.input.hex, set, "value", self.hex.replace("#", ""));
        iterateElements(self.data.input.rgb.r, set, "value", r(self.rgb));
        iterateElements(self.data.input.rgb.g, set, "value", g(self.rgb));
        iterateElements(self.data.input.rgb.b, set, "value", b(self.rgb));
        iterateElements(self.data.input.hsv.h, set, "value", h(self.hsv));
        iterateElements(self.data.input.hsv.s, set, "value", s(self.hsv));
        iterateElements(self.data.input.hsv.v, set, "value", v(self.hsv));
        iterateElements(self.data.input.hsl.h, set, "value", h(self.hsl));
        iterateElements(self.data.input.hsl.s, set, "value", s(self.hsl));
        iterateElements(self.data.input.hsl.l, set, "value", l(self.hsl));
        iterateElements(self.data.preview, style, "backgroundColor", self.hex);
        iterateElements(self.data.track.rgb.r, style, "backgroundImage", self.data.gradient.rgb.r);
        iterateElements(self.data.track.rgb.g, style, "backgroundImage", self.data.gradient.rgb.g);
        iterateElements(self.data.track.rgb.b, style, "backgroundImage", self.data.gradient.rgb.b);
        iterateElements(self.data.track.hsv.s, style, "backgroundImage", self.data.gradient.hsv.s);
        iterateElements(self.data.track.hsv.v, style, "backgroundImage", self.data.gradient.hsv.v);
        iterateElements(self.data.track.hsl.s, style, "backgroundImage", self.data.gradient.hsl.s);
        iterateElements(self.data.track.hsl.l, style, "backgroundImage", self.data.gradient.hsl.l);
        iterateElements(self.data.track.hsv.h, style, "backgroundImage", self.data.gradient.hue);
        iterateElements(self.data.track.hsl.h, style, "backgroundImage", self.data.gradient.hue);
        // todo: responsive hue
        return false;
    }
    function set(property, value, element) {
        if (document.activeElement !== element) {
            var min = parseFloat(element.getAttribute("min"));
            var max = parseFloat(element.getAttribute("max"));
            if (!isNaN(min)) value = parseFloat(value) < min ? min : value;
            if (!isNaN(max)) value = parseFloat(value) > max ? max : value;
            element[property] = value;
        }
        return false;
    }
    function style(property, value, element) {
        element.style[property] = value;
        return false;
    }
    function settings() {
        return {
            color: "#00FFBF",
            allowArrows: true,
            allowFocusFix: true,
            allowValidation: true,
            // outputHash: true,
            // outputPercentage: false,
            outputFormat: "auto",
            preview: "[data-aquamarine=preview]",
            input: {
                hex: "[data-aquamarine=hex]",
                rgb: {
                    r: "[data-aquamarine=rgb-r]",
                    g: "[data-aquamarine=rgb-g]",
                    b: "[data-aquamarine=rgb-b]"
                },
                hsv: {
                    h: "[data-aquamarine=hsv-h]",
                    s: "[data-aquamarine=hsv-s]",
                    v: "[data-aquamarine=hsv-v]"
                },
                hsl: {
                    h: "[data-aquamarine=hsl-h]",
                    s: "[data-aquamarine=hsl-s]",
                    l: "[data-aquamarine=hsl-l]"
                },
                range: "[data-aquamarine][type=range]",
                text: "[data-aquamarine][type=text][min][max]"
            },
            track: {
                rgb: {
                    r: "[data-aquamarine=track-rgb-r]",
                    g: "[data-aquamarine=track-rgb-g]",
                    b: "[data-aquamarine=track-rgb-b]"
                },
                hsv: {
                    h: "[data-aquamarine=track-hsv-h]",
                    s: "[data-aquamarine=track-hsv-s]",
                    v: "[data-aquamarine=track-hsv-v]"
                },
                hsl: {
                    h: "[data-aquamarine=track-hsl-h]",
                    s: "[data-aquamarine=track-hsl-s]",
                    l: "[data-aquamarine=track-hsl-l]"
                }
            },
            gradient: {
                hue: gradient("hsl(0, 100%, 50%)", "hsl(60, 100%, 50%)", "hsl(120, 100%, 50%)", "hsl(180, 100%, 50%)", "hsl(240, 100%, 50%)", "hsl(300, 100%, 50%)", "hsl(360, 100%, 50%)"),
                rgb: {
                    r: "",
                    g: "",
                    b: ""
                },
                hsv: {
                    h: "",
                    s: "",
                    v: ""
                },
                hsl: {
                    h: "",
                    s: "",
                    l: ""
                }
            }
        };
    }
    function format(color) {
        if (typeof color === "string") {
            if (tinycolor(color).getFormat() === "name") return "name";
            if (/(^#[a-fA-F0-9]{3}$)|(^#[a-fA-F0-9]{6}$)/.test(color)) return "hex"; else if (/^rgb\((\s*[0-9]+\s*,){2}\s*[0-9]+\s*\)$/.test(color)) return "rgb"; else if (/^hsv\(\s*[0-9]+(\.[0-9]+)?\s*,\s*[0-9]+(\.[0-9]+)?%\s*,\s*[0-9]+(\.[0-9]+)?%\s*\)$/.test(color)) return "hsv"; else if (/^hsl\(\s*[0-9]+(\.[0-9]+)?\s*,\s*[0-9]+(\.[0-9]+)?%\s*,\s*[0-9]+(\.[0-9]+)?%\s*\)$/.test(color)) return "hsl"; else if (/^rgba\((\s*[0-9]+\s*,){3}\s*[0-9]+(\.[0-9]+)?\s*\)$/.test(color)) return "rgba"; else if (/^hsva\(\s*[0-9]+(\.[0-9]+)?\s*,(\s*[0-9]+(\.[0-9]+)?%\s*,){2}\s*[0-9]+(\.[0-9]+)?\s*\)$/.test(color)) return "hsva"; else if (/^hsla\(\s*[0-9]+(\.[0-9]+)?\s*,(\s*[0-9]+(\.[0-9]+)?%\s*,){2}\s*[0-9]+(\.[0-9]+)?\s*\)$/.test(color)) return "hsla";
        }
        return false;
    }
    function isName(color) {
        return format(color) === "name";
    }
    function isHex(color) {
        return format(color) === "hex";
    }
    function isRgb(color) {
        return format(color) === "rgb";
    }
    function isHsl(color) {
        return format(color) === "hsl";
    }
    function isHsv(color) {
        return format(color) === "hsv";
    }
    function isRgba(color) {
        return format(color) === "rgba";
    }
    function isHsla(color) {
        return format(color) === "hsla";
    }
    function isHsva(color) {
        return format(color) === "hsva";
    }
    function match(color, pattern, value, integer) {
        if (typeof value === "string" || typeof value === "number") {
            value = integer ? parseInt(value) : parseFloat(value);
            return isNaN(value) ? false : color.replace(pattern, value);
        } else return color.match(pattern)[0];
    }
    function r(color, value) {
        if (isRgb(color) || isRgba(color)) return match(color, /[0-9]+(?=(\s*,\s*[0-9]+\s*,\s*[0-9]+(\s*,\s*[0-9]+(\.[0-9]+)?)?\s*\)$))/, value, true); else return false;
    }
    function g(color, value) {
        if (isRgb(color) || isRgba(color)) return match(color, /[0-9]+(?=(\s*,\s*[0-9]+(\s*,\s*[0-9]+(\.[0-9]+)?)?\s*\)$))/, value, true); else return false;
    }
    function b(color, value) {
        if (isRgb(color) || isRgba(color)) return match(color, /[0-9]+(?=(\s*,\s*[0-9]+(\.[0-9]+)?)?\s*\)$)/, value, true); else return false;
    }
    // todo: make sure includes a?
    function h(color, value) {
        if (isHsv(color) || isHsva(color) || isHsl(color) || isHsla(color)) return match(color, /[0-9]+(\.[0-9]+)?(?=(\s*,\s*[0-9]+(\.[0-9]+)?%\s*,\s*[0-9]+(\.[0-9]+)?%(\s*,\s*[0-9]+(\.[0-9]+)?)?\s*\)$))/, value); else return false;
    }
    function s(color, value) {
        if (isHsv(color) || isHsva(color) || isHsl(color) || isHsla(color)) return match(color, /[0-9]+(\.[0-9]+)?(?=(%\s*,\s*[0-9]+(\.[0-9]+)?%(\s*,\s*[0-9]+(\.[0-9]+)?)?\s*\)$))/, value); else return false;
    }
    function l(color, value) {
        if (isHsl(color) || isHsla(color)) return match(color, /[0-9]+(\.[0-9]+)?(?=(%(\s*,\s*[0-9]+(\.[0-9]+)?)?\s*\)$))/, value); else return false;
    }
    function v(color, value) {
        if (isHsv(color) || isHsva(color)) return match(color, /[0-9]+(\.[0-9]+)?(?=(%(\s*,\s*[0-9]+(\.[0-9]+)?)?\s*\)$))/, value); else return false;
    }
    function a(color, value) {
        if (isName(color) || isHex(color) || isRgb(color) || isHsv(color) || isHsl(color)) return 1; else if (isRgba(color) || isHsva(color) || isHsla(color)) return match(color, /[0-9]+(\.[0-9]+)?(?=(\s*\)$))/, value); else return false;
    }
    function gradient() {
        var colors = [];
        for (var i = 0; i < arguments.length; i++) colors.push(tinycolor(arguments[i]).toHexString());
        if (colors.length === 0) return false;
        if (colors.length === 1) colors[1] = colors[0];
        var gradient = "linear-gradient(to right";
        for (var i = 0; i < colors.length; i++) {
            var position = i * 100 / (colors.length - 1);
            gradient += ", " + colors[i] + " " + position + "%";
        }
        gradient += ")";
        return gradient;
    }
    function input(self, element) {
        var value = element.value;
        if (matches(element, self.data.input.hex)) self.color("#" + value); else if (matches(element, self.data.input.rgb.r)) self.color(r(self.rgb, value)); else if (matches(element, self.data.input.rgb.g)) self.color(g(self.rgb, value)); else if (matches(element, self.data.input.rgb.b)) self.color(b(self.rgb, value)); else if (matches(element, self.data.input.hsv.h)) self.color(h(self.hsv, value)); else if (matches(element, self.data.input.hsv.s)) self.color(s(self.hsv, value)); else if (matches(element, self.data.input.hsv.v)) self.color(v(self.hsv, value)); else if (matches(element, self.data.input.hsl.h)) self.color(h(self.hsl, value)); else if (matches(element, self.data.input.hsl.s)) self.color(s(self.hsl, value)); else if (matches(element, self.data.input.hsl.l)) self.color(l(self.hsl, value));
        return value;
    }
    function matches(element, nodeList) {
        var i = NodeList.prototype.isPrototypeOf(nodeList) ? nodeList.length : -1;
        while (--i >= 0 && nodeList.item(i) !== element) {}
        return i > -1;
    }
    // Merges all properties and sub-properties of source and overrides.
    // Type of a property should be equal across objects for overrides to be honored
    // Ditches properties not present in source
    function merge(overrides, source) {
        var result = {};
        if (typeof overrides === "object" && typeof source === "object") for (var prop in source) result[prop] = merge(overrides[prop], source[prop]); else if (typeof overrides === typeof source) result = overrides; else result = source;
        return result;
    }
    // Takes a nested object and iterates querySelectorAll on end properties
    function iterateQuerySelectorAll(object) {
        var result = {};
        if (typeof object === "object") {
            for (var prop in object) result[prop] = iterateQuerySelectorAll(object[prop]);
        } else {
            result = document.querySelectorAll(object);
            result = result.length ? result : object;
        }
        // console.log(result.length ? result : object)
        return result;
    }
    // Adds one or more event listeners, e.g. "change input focusout"
    function addEventListener(events, handler, handlerArgs, element) {
        events.split(" ").forEach(function(event) {
            element.addEventListener(event, function(event) {
                handler.apply(null, createFlatArray(handlerArgs, element, event));
            });
        });
    }
    // Removes one or more event listeners. "events" argument should be either string or an array of strings
    function removeEventListener(events, handler, handlerArgs, element) {
        events.split(" ").forEach(function(event) {
            element.removeEventListener(event, function() {
                handler.apply(null, createFlatArray(handlerArgs, element, event));
            });
        });
    }
    // If "object" is a DOM element, call "handler". If not, look for DOM elements in object properties and its sub-properties
    // Arguments other than object and handler will be passed into handler
    function iterateElements(object, handler) {
        var handlerArgs = {
            _args: []
        };
        if (typeof arguments[2] === "object" && arguments.length === 3) handlerArgs._args = arguments[2].hasOwnProperty("_args") ? arguments[2]._args : arguments[2]; else for (var i = 2; i < arguments.length; i++) handlerArgs._args.push(arguments[i]);
        if (isElement(object)) handler.apply(null, createFlatArray(handlerArgs._args, object)); else if (typeof object === "object") for (var prop in object) iterateElements(object[prop], handler, handlerArgs);
        return false;
    }
    // Creates a flat array from multiple arrays and / or primitives. Keeps subarrays.
    // 1, 2, 3 -> [1, 2, 3]
    // [1, 2, [3, 4, 5]], 6, 7, [8, 9] -> [1, 2, [3, 4, 5], 6, 7, 8, 9]
    function createFlatArray() {
        var array = [];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] !== "undefined") {
                if (arguments[i].constructor === Array) array.push.apply(array, arguments[i]); else array.push.apply(array, [ arguments[i] ]);
            }
        }
        return array;
    }
    function isNode(object) {
        return typeof Node === "object" ? object instanceof Node : object && typeof object === "object" && typeof object.nodeType === "number" && typeof object.nodeName === "string";
    }
    function isElement(object) {
        //DOM2
        return typeof HTMLElement === "object" ? object instanceof HTMLElement : object && typeof object === "object" && object !== null && object.nodeType === 1 && typeof object.nodeName === "string";
    }
    window.Aquamarine = Aquamarine;
})();