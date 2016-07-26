/* Version 0.11 */

(function() {

  function Aquamarine(arg) {
    this.data = format(arg) ? merge({ color: arg }, settings()) : merge(arg, settings());
    this.data.input = iterateQuerySelectorAll(this.data.input);
    this.data.track = iterateQuerySelectorAll(this.data.track);
    this.data.preview = iterateQuerySelectorAll(this.data.preview);
    this.color = color;
    this.color(this.data.color);
    var self = this;
    collect(this.data.input).listen("input change", function() {
      input(this, self)
    });
    collect(this.data.input).listen("focusout", function() {
      output(self)
    });
    if (this.data.allowFocusFix)
      collect(this.data.input.range).listen("click change", function() {
        this.focus()
      });
    if (this.data.allowArrows)
      collect(this.data.input.text).listen("keydown", function(event) {
        arrowControl(this, event)
      });
  }

  function Collection() {
    this.elements = [];
    this.listen = listen;
    this.set = set;
    this.value = value;
    this.backgroundImage = backgroundImage;
    this.backgroundColor = backgroundColor;
  }

  function value(value) {
    this.set("value", value)
  }
  
  function backgroundImage(value) {
    this.set("style.backgroundImage", value)
  }
  
  function backgroundColor(value) {
    this.set("style.backgroundColor", value)
  }

  function set(property, value) {
    var elements = this.elements;
    elements.forEach(function(element) {
      if (document.activeElement !== element) {
        var min = parseFloat(element.getAttribute("min"));
        var max = parseFloat(element.getAttribute("max"));
        if (!isNaN(min))
          value = parseFloat(value) < min ? min : value;   
        if (!isNaN(max))
          value = parseFloat(value) > max ? max : value;
        if (typeof property === "string") {
          var split = property.split(".");
          var chain = element;
          var i;
          for (i = 0; i + 1 < split.length; i++)
            chain = chain[split[i]]
          chain[split[i]] = value;
        }
      }
    });
    return false;
  }

  function collect(object) {
    var result = new Collection();
    if (isElement(object))
      result.elements.push(object);
    else if (typeof object === 'object' && object !== null)
      for (var prop in object)
        result.elements = object.hasOwnProperty(prop) ? weave(result.elements, collect(object[prop]).elements) : result.elements;
    return result;
  }

  function listen(events, handler) {
    var elements = this.elements;
    events.split(" ").forEach(function(event) {
      elements.forEach(function(element) {
        element.addEventListener(event, handler)
      });
    });
  }

  function arrowControl(element, event) {
    var value = parseFloat(element.value);
    var min = parseFloat(element.getAttribute("min"));
    var max = parseFloat(element.getAttribute("max"));
    var change = new Event("change");
    switch(event.which) {
      case 37: // Left
        if (element.selectionStart === 0 && value > min) {
          element.value = value - 1;
          element.dispatchEvent(change);
          element.selectionStart = 0;
        }
        break;
      case 38: // Up
        if (element.selectionStart === 0 && value < max) {
          element.value = value + 1;
          element.dispatchEvent(change);
          element.selectionStart = 0;
        }
        break;
      case 39: // Right
        if (element.value.length === element.selectionEnd && value < max) {
          element.value = value + 1;
          element.dispatchEvent(change);
          element.selectionEnd = element.value.length;
        }
        break;
      case 40: // Down
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

  // To-do: sync h in hsl and hsv
  function sync(self) {
    self.hex = tinycolor(self.data.color).toHexString();
    self.rgb = tinycolor(self.data.color).setAlpha(1).toRgbString();
    self.hsv = isHsv(self.data.color) ? self.data.color : tinycolor(self.data.color).setAlpha(1).toHsvString();
    self.hsl = isHsl(self.data.color) ? self.data.color : tinycolor(self.data.color).setAlpha(1).toHslString();
    self.data.gradient.rgb.r = gradient(
      "rgb(0,"   + g(self.rgb) + "," + b(self.rgb) + ")",
      "rgb(255," + g(self.rgb) + "," + b(self.rgb) + ")"
    );
    self.data.gradient.rgb.g = gradient(
      "rgb(" + r(self.rgb) + ", 0," + b(self.rgb) + ")",
      "rgb(" + r(self.rgb) + ", 255," + b(self.rgb) + ")"
    );
    self.data.gradient.rgb.b = gradient(
      "rgb(" + r(self.rgb) + "," + g(self.rgb) + ", 0)" ,
      "rgb(" + r(self.rgb) + "," + g(self.rgb) + ", 255)"
    );
    self.data.gradient.hsv.s = gradient(
      "hsv(" + h(self.hsv) + ", 0%," + v(self.hsv) + "%)",
      "hsv(" + h(self.hsv) + ", 100%," + v(self.hsv) + "%)"
    );
    self.data.gradient.hsv.v = gradient(
      "hsv(" + h(self.hsv) + "," + s(self.hsv) + "%, 0%)",
      "hsv(" + h(self.hsv) + "," + s(self.hsv) + "%, 100%)"
    );
    self.data.gradient.hsl.s = gradient(
      "hsl(" + h(self.hsl) + ", 0%," + l(self.hsl) + "%)",
      "hsl(" + h(self.hsl) + ", 100%," + l(self.hsl) + "%)"
    );
    self.data.gradient.hsl.l = gradient(
      "hsl(" + h(self.hsl) + "," + s(self.hsl) + "%, 0%)",
      "hsl(" + h(self.hsl) + "," + s(self.hsl) + "%, 50%)",
      "hsl(" + h(self.hsl) + "," + s(self.hsl) + "%, 100%)"
    );
    return true;
  }
 
  function output(self) {
    collect(self.data.input.hex).value(self.hex.replace("#", ""));
    collect(self.data.input.rgb.r).value(r(self.rgb));
    collect(self.data.input.rgb.g).value(g(self.rgb));
    collect(self.data.input.rgb.b).value(b(self.rgb));
    collect(self.data.input.hsv.h).value(h(self.hsv));
    collect(self.data.input.hsv.s).value(s(self.hsv));
    collect(self.data.input.hsv.v).value(v(self.hsv));
    collect(self.data.input.hsl.h).value(h(self.hsl));
    collect(self.data.input.hsl.s).value(s(self.hsl));
    collect(self.data.input.hsl.l).value(l(self.hsl));
    collect(self.data.preview).backgroundColor(self.hex);
    collect(self.data.track.rgb.r).backgroundImage(self.data.gradient.rgb.r);
    collect(self.data.track.rgb.g).backgroundImage(self.data.gradient.rgb.g);
    collect(self.data.track.rgb.b).backgroundImage(self.data.gradient.rgb.b);
    collect(self.data.track.hsv.s).backgroundImage(self.data.gradient.hsv.s);
    collect(self.data.track.hsv.v).backgroundImage(self.data.gradient.hsv.v);
    collect(self.data.track.hsl.s).backgroundImage(self.data.gradient.hsl.s);
    collect(self.data.track.hsl.l).backgroundImage(self.data.gradient.hsl.l);
    collect(self.data.track.hsv.h).backgroundImage(self.data.gradient.hue);
    collect(self.data.track.hsl.h).backgroundImage(self.data.gradient.hue);
    return false;
  }

  function settings() {
    return {
      color: "#2CE7C5",
      allowArrows: true,
      allowFocusFix: true,
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
        text:  "[data-aquamarine][type=text][min][max]",
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
        hue: gradient(
          "hsl(0, 100%, 50%)",
          "hsl(60, 100%, 50%)",
          "hsl(120, 100%, 50%)",
          "hsl(180, 100%, 50%)",
          "hsl(240, 100%, 50%)",
          "hsl(300, 100%, 50%)",
          "hsl(360, 100%, 50%)"
        ),
        rgb: { r: "", g: "", b: "" },
        hsv: { h: "", s: "", v: "" },
        hsl: { h: "", s: "", l: "" }
      }
    }
  }

  function format(color) {
    if (typeof color === "string") { 
      if (tinycolor(color).getFormat() === "name")
        return "name";
      if (/(^#[a-fA-F0-9]{3}$)|(^#[a-fA-F0-9]{6}$)/.test(color))
        return "hex";
      else if (/^rgb\((\s*[0-9]+\s*,){2}\s*[0-9]+\s*\)$/.test(color))
        return "rgb";
      else if (/^hsv\(\s*[0-9]+(\.[0-9]+)?\s*,\s*[0-9]+(\.[0-9]+)?%\s*,\s*[0-9]+(\.[0-9]+)?%\s*\)$/.test(color))
        return "hsv";
      else if (/^hsl\(\s*[0-9]+(\.[0-9]+)?\s*,\s*[0-9]+(\.[0-9]+)?%\s*,\s*[0-9]+(\.[0-9]+)?%\s*\)$/.test(color))
        return "hsl";
      else if (/^rgba\((\s*[0-9]+\s*,){3}\s*[0-9]+(\.[0-9]+)?\s*\)$/.test(color))
        return "rgba";
      else if (/^hsva\(\s*[0-9]+(\.[0-9]+)?\s*,(\s*[0-9]+(\.[0-9]+)?%\s*,){2}\s*[0-9]+(\.[0-9]+)?\s*\)$/.test(color))
        return "hsva";
      else if (/^hsla\(\s*[0-9]+(\.[0-9]+)?\s*,(\s*[0-9]+(\.[0-9]+)?%\s*,){2}\s*[0-9]+(\.[0-9]+)?\s*\)$/.test(color))
        return "hsla";
    }
    return false;
  }

  function isHex(color)  { return format(color) === "hex";  }
  function isRgb(color)  { return format(color) === "rgb";  }
  function isHsl(color)  { return format(color) === "hsl";  }
  function isHsv(color)  { return format(color) === "hsv";  }
  function isName(color) { return format(color) === "name"; }
  function isRgba(color) { return format(color) === "rgba"; }
  function isHsla(color) { return format(color) === "hsla"; }
  function isHsva(color) { return format(color) === "hsva"; }

  function match(color, pattern, value, integer) {
    if (typeof value === "string" || typeof value === "number") {
      value = integer ? parseInt(value) : parseFloat(value);
      return isNaN(value) ? false : color.replace(pattern, "$1" + value + "$3");
    }
    else return color.match(pattern)[2];
  }

  function r(color, value) {
    if (isRgb(color) || isRgba(color))
      return match(color, /(rgba?\(\s*)([0-9]+)(.*)/, value, true)
    else return false;
  }

  function g(color, value) {
    if (isRgb(color) || isRgba(color))
      return match(color, /(rgba?\(\s*[0-9]+\s*,\s*)([0-9]+)(.*)/, value, true);
    else return false;
  }

  function b(color, value) {
    if (isRgb(color) || isRgba(color))
      return match(color, /(rgba?\(\s*[0-9]+\s*,\s*[0-9]+\s*,\s*)([0-9]+)(.*)/, value, true);
    else return false;
  }

  function h(color, value) {
    if (isHsv(color) || isHsva(color) || isHsl(color) || isHsla(color))
      return match(color, /(hs\wa?\(\s*)([0-9]+)(.*)/, value);
    else return false;
  }

  function s(color, value) {
    if (isHsv(color) || isHsva(color) || isHsl(color) || isHsla(color))
      return match(color, /(hs\wa?\(\s*[0-9]+\s*,\s*)([0-9]+)(?=%)(.*)/, value);
    else return false;
  }

  function l(color, value) {
    if (isHsl(color) || isHsla(color))
      return match(color, /(hsla?\(\s*[0-9]+\s*,\s*[0-9]+%\s*,\s*)([0-9]+)(?=%)(.*)/, value);
    else return false;
  }

  function v(color, value) {
    if (isHsv(color) || isHsva(color))
      return match(color, /(hsva?\(\s*[0-9]+\s*,\s*[0-9]+%\s*,\s*)([0-9]+)(?=%)(.*)/, value);
    else return false;
  }

  function a(color, value) {
    if (isName(color) || isHex(color) || isRgb(color) || isHsv(color) || isHsl(color))
      return 1;
    else if (isRgba(color) || isHsva(color) || isHsla(color))
      return match(color, /(a.*?)([0-9]+\.?[0-9]*?)(\)\s*$)/, value);
    else return false;
  }

  function gradient() {
    var colors = [];
    for (var i = 0; i < arguments.length; i++)
      colors.push(tinycolor(arguments[i]).toHexString());
    if (colors.length === 0)
      return false;
    if (colors.length === 1)
      colors[1] = colors[0];
    var gradient = "linear-gradient(to right";
    for (var i = 0; i < colors.length; i++) {
      var position = i * 100 / (colors.length - 1);
      gradient += ", " + colors[i] + " " + position + "%";
    }
    gradient += ")";
    return gradient; 
  };

  function input(element, self) {
    var value = element.value;
    if (matches(element, self.data.input.hex))
      self.color("#" + value);
    else if (matches(element, self.data.input.rgb.r))
      self.color(r(self.rgb, value));
    else if (matches(element, self.data.input.rgb.g))
      self.color(g(self.rgb, value));
    else if (matches(element, self.data.input.rgb.b))
      self.color(b(self.rgb, value));
    else if (matches(element, self.data.input.hsv.h))
      self.color(h(self.hsv, value));
    else if (matches(element, self.data.input.hsv.s))
      self.color(s(self.hsv, value));
    else if (matches(element, self.data.input.hsv.v))
      self.color(v(self.hsv, value));
    else if (matches(element, self.data.input.hsl.h))
      self.color(h(self.hsl, value));
    else if (matches(element, self.data.input.hsl.s))
      self.color(s(self.hsl, value));
    else if (matches(element, self.data.input.hsl.l))
      self.color(l(self.hsl, value));
    return value;
  }

  function matches(element, nodeList) {
    var i = NodeList.prototype.isPrototypeOf(nodeList) ? nodeList.length : -1;
    while (--i >= 0 && nodeList.item(i) !== element) { }
    return i > -1;
  }

  /*
  Merges all properties and sub-properties of source and overrides.
  Type of a property should be equal across objects for overrides to be honored
  Ditches properties not present in source
  */
  function merge(overrides, source) {
    var result = {};
    if (typeof overrides === "object" && typeof source === "object")
      for (var prop in source)
        result[prop] = merge(overrides[prop], source[prop]);
    else if (typeof overrides === typeof source)
      result = overrides;
    else
      result = source;
    return result;
  }

  /*
  Takes a nested object and iterates querySelectorAll on end properties
  */
  function iterateQuerySelectorAll(object) {
    var result = {};
    if (typeof object === 'object') {
      for (var prop in object)
        result[prop] = iterateQuerySelectorAll(object[prop]);
    }
    else {
      result = document.querySelectorAll(object);
      result = result.length ? result : object;
    }
    return result;
  }

  /*
  Creates a flat array from multiple arrays and / or primitives. Keeps subarrays.
  1, 2, 3 -> [1, 2, 3]
  [1, 2, [3, 4, 5]], 6, 7, [8, 9] -> [1, 2, [3, 4, 5], 6, 7, 8, 9]
  */
  function weave() {
    var array = [];
    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] !== "undefined") {
        if (arguments[i].constructor === Array)
          array.push.apply(array, arguments[i]);
        else
          array.push.apply(array, [arguments[i]]);
      }
    }
    return array
  }

  function isNode(object) {
    return (
      typeof Node === "object" ? object instanceof Node : 
      object && typeof object === "object" && typeof object.nodeType === "number" && typeof object.nodeName==="string"
    );
  }

  function isElement(object) {
    return (
      typeof HTMLElement === "object" ? object instanceof HTMLElement :
      object && typeof object === "object" && object !== null && object.nodeType === 1 && typeof object.nodeName==="string"
    );
  }

  if ( typeof module != 'undefined' && module.exports ) {
    module.exports = Aquamarine;
  } else if ( typeof define == 'function' && define.amd ) {
    define( function () { return Aquamarine; } );
  } else {
    window.Aquamarine = Aquamarine;
  }

}());