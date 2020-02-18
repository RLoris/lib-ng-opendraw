
# Opendraw

Opendraw is an angular component that manipulates the canvas for drawing content across all devices. It supports touch/pen/mouse devices. It uses pointerEvent to detect the device.

# Demo

Try it out here: [DEMO](https://rloris.github.io/lib-ng-opendraw/) or clone this [repo](https://github.com/RLoris/lib-ng-opendraw) and run `ng serve` for a full demo of opendraw. Angular version 8.2.14.

# Features

* Draw with different devices (mouse|pen|touch)
* Export your drawings
* Handle foreground and background layer (image|color)
* Configure drawing style (color|width|shapes|eraser)
* Configure allowed devices (mouse|pen|touch|all)

# How to use

```
<ng-opendraw 
    [canHeight]='this.height'
    [canWidth]='this.width'
    [lineWidth]='this.lineWidth'
    [lineColor]='this.getColor()'
    [commandObs]='this.commandObs$'
    [drawStyle]='this.drawStyle'
    [fillShape]='this.fillShape'
    [eraser]='this.eraser'
    [allowedDeviceType]='this.allowedDeviceType'
    [backgroundImage]='this.bgImg'
    [backgroundColor]='this.bgColor'
    (outputEvent)='this.processResult($event)'
    (errorEvent)='this.processError($event)'
></ng-opendraw>
```
## Inputs
| Property | Type | Note |
| -------- | ---- | ---- |
| [canHeight]| number | Height of the canvas area in px |
| [canWidth] | number | Width of the canvas area in px |
| [lineWidth] | number | Line width in px, default: 3 |
| [lineColor] | string | Line color, default: black |
| [commandObs] | Observable(DrawCommand) | Triggers a drawcommand like export, clear, ... | 
| [drawStyle] | DrawStyle | Specify the drawing style like normal, circle, rectangle, line... default: normal |
| [fillShape] | boolean | Enable/disable shape filling |
| [eraser] | boolean | Enable/disable eraser |
| [allowedDeviceType] | DeviceType | Specify the allowed device type like mouse, touch, pen... default: all |
| [backgroundImage] | Image/HTMLImageElement | Specify the background layer image |
| [backgroundColor] | string | Specify the background layer color |

## Outputs
| Event | Type | Note |
| -------- | ---- | ---- |
| (outputEvent) | string | Emits the exported drawing image |
| (errorEvent) | any | Emits all errors |

# To-Do / Improvements

-   Layers (add|remove|select|hide)
-   Undo / Redo actions

# NPM

  This package is on `npm` https://www.npmjs.com/package/ng-opendraw

# License

  This package is under the MIT license

