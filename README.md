## Aquamarine
Aquamarine is a customizable JavaScript color picker plugin that supports HSV / HSB color model

## Demo

[HSV](https://rawgit.com/vladmoroz/Aquamarine/master/demo/hsv.html)

[HSL](https://rawgit.com/vladmoroz/Aquamarine/master/demo/hsl.html)

[RGB](https://rawgit.com/vladmoroz/Aquamarine/master/demo/rgb.html)

[HSV and RGB](https://rawgit.com/vladmoroz/Aquamarine/master/demo/multiple.html)

## Dependencies
Aquamarine uses [Tinycolor](https://github.com/bgrins/TinyColor) for color conversion

## Setup
Just include it in the page in a ``script`` tag along with [Tinycolor](https://github.com/bgrins/TinyColor)

```html
<script type='text/javascript' src='tinycolor.js'></script>
<script type='text/javascript' src='aquamarine.js'></script>
```

## Examples

Initialize

```javascript
var colorpicker = new Aquamarine() // Initialize new instance. If no arguments passed, default color will be #2CE7C5
```
```javascript
var colorpicker = new Aquamarine("#EA394F")
```
```javascript
var colorpicker = new Aquamarine("#fff")
```
```javascript
var colorpicker = new Aquamarine("royalblue")
```
```javascript
var colorpicker = new Aquamarine("rgb(242, 231, 31)")
```
```javascript
var colorpicker = new Aquamarine("hsl(210, 100%, 45%)")
```
```javascript
var colorpicker = new Aquamarine("hsv(20, 75%, 100%)")
```

Set and get color

``color`` method accepts any legal CSS color values, plus HSV colors

```javascript
var colorpicker = new Aquamarine()

colorpicker.color("indigo") // Set color to "indigo"

colorpicker.color("hsv(240, 75%, 100%)") // Set color to "hsv(240, 75%, 100%)"

colorpicker.color("rgb(255, 105, 180)") // Set color to "rgb(255, 105, 180)"

colorpicker.color() // "rgb(255, 105, 180)"

colorpicker.hex // "#ff69b4"

colorpicker.rgb // "rgb(255, 105, 180)"

colorpicker.hsl // "hsl(330, 100%, 71%)"

colorpicker.hsv // "hsv(330, 59%, 100%)"
```

## HTML

Script looks for elements with ``data-aquamarine`` attribute and matches value of the attribute with color model parameter. You should use this attribute on ``type="range"`` and ``type="text"`` inputs.

```html
<!-- Example hex text input -->
<input type="text" data-aquamarine="hex" autocomplete="off">

<!-- Example red in RGB color model text input -->
<input type="text" data-aquamarine="rgb-r" autocomplete="off" min="0" max="255">

<!-- Example green in RGB color model text input -->
<input type="text" data-aquamarine="rgb-g" autocomplete="off" min="0" max="255">

<!-- Example blue in RGB color model text input -->
<input type="text" data-aquamarine="rgb-b" autocomplete="off" min="0" max="255">

<!-- Example hue in HSV / HSB color model range input -->
<input type="range" data-aquamarine="hsv-h" min="0" max="360">

<!-- Example saturation in HSV / HSB color model range input -->
<input type="range" data-aquamarine="hsv-s" min="0" max="100">

<!-- Example brightness in HSV / HSB color model range input -->
<input type="range" data-aquamarine="hsv-v" min="0" max="100">
```

Set ``data-aquamarine`` attribute to one of following values:

```html	
hex, rgb-r, rgb-g, rgb-b, hsl-h, hsl-s, hsl-l, hsv-h, hsv-s, hsv-v
```

Don't forget to set ``min`` and ``max`` attributes on ``type="text"`` and ``type="range"`` inputs

## Range input tracks

Notice that range input tracks respond to color change in the [demos](https://rawgit.com/vladmoroz/Aquamarine/master/demo/multiple.html). To get this effect, use a separate HTML element for input tracks:
```html
<!-- Example brightness track in HSV / HSB color model range input -->
<div data-aquamarine="track-hsv-v"></div>
```

Script will set element's ``background-image`` as color changes.

Set ``data-aquamarine`` attribute to one of following values:
```html
track-rgb-r, track-rgb-g, track-rgb-b, track-hsl-h, track-hsl-s, track-hsl-l, track-hsv-h, track-hsv-s, track-hsv-v
```

Inspect the demos to get a better feel of how to style the range inputs.

## Alpha
Alpha channels will be supported in future

## Browser support
Chrome, Safari, Firefox, IE10+
