## Aquamarine
Aquamarine is a customizable color picker plugin that support HSV / HSB color model

## Demo

[HSV color model](https://rawgit.com/vladmoroz/Aquamarine/master/demo/hsv.html)

[HSL color model](https://rawgit.com/vladmoroz/Aquamarine/master/demo/hsl.html)

[RGB color model](https://rawgit.com/vladmoroz/Aquamarine/master/demo/rgb.html)

[HSV and RGB color models](https://rawgit.com/vladmoroz/Aquamarine/master/demo/rgb.html)

## Examples

Initialize

	var colorpicker = new Aquamarine()

	var colorpicker = new Aquamarine("royalblue")

	var colorpicker = new Aquamarine("rgb(242, 231, 31)")

	var colorpicker = new Aquamarine("hsl(210, 100%, 45%)")

	var colorpicker = new Aquamarine("hsv(20, 75%, 100%)")
	
Set and get color
	
	colorpicker.color("hotpink") // Set color to "hotpink". Aquamarine accepts any CSS color format
	colorpicker.color() // "hotpink"
	colorpicker.hex // "#ff69b4"
	colorpicker.rgb // "rgb(255, 105, 180)"
	colorpicker.hsl // "hsl(330, 100%, 71%)"
	colorpicker.hsv // "hsl(330, 59%, 100%)"
