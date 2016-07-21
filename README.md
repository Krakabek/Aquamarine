## Aquamarine
Aquamarine is a customizable JavaScript color picker plugin that supports HSV / HSB color model

## Demo

[HSV](https://rawgit.com/vladmoroz/Aquamarine/master/demo/hsv.html)

[HSL](https://rawgit.com/vladmoroz/Aquamarine/master/demo/hsl.html)

[RGB](https://rawgit.com/vladmoroz/Aquamarine/master/demo/rgb.html)

[HSV and RGB](https://rawgit.com/vladmoroz/Aquamarine/master/demo/multiple.html)

## Examples

_Initialize_

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

_Set and get color_

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

Allowed ``data-aqumarine`` values

```html	
hex, rgb-r, rgb-g, rgb-b, hsl-h, hsl-s, hsl-l, hsv-h, hsv-s, hsv-v
```

Don't forget to set ``min`` and ``max`` attributes on ``type="text"`` and ``type="range"`` inputs

## Alpha
Alpha channels will be supported in future

## Browser support
Chrome, Safari, Firefox, IE10+
