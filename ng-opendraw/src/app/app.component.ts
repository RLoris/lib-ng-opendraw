import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { DrawCommand } from 'projects/ng-opendraw/src/lib/models/draw-command';
import { CommandType } from 'projects/ng-opendraw/src/lib/models/command-type';
import { DrawStyle } from 'projects/ng-opendraw/src/lib/models/draw-style';
import { DeviceType } from 'projects/ng-opendraw/src/lib/models/device-type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'ng-opendraw';
  
  commandObs$ = new Subject<any>();
  exportObs$ = new Subject<any>();
  lineWidth = 3;
  lineColor: string = "black";
  width = 500;
  height = 500;
  bgImg: HTMLImageElement = null;
  bgColor: string = null;
  drawStyle: DrawStyle = DrawStyle.NORMAL;
  allowedDeviceType: DeviceType = DeviceType.ALL;
  fillShape = false;
  eraser = false;
  randomColor = false;

  constructor() {}

  getDrawStyleList() {
    return Object.keys(DrawStyle).filter(key => !isNaN(Number(DrawStyle[key])));  
  }

  getDrawStyle(ds) {
    return DrawStyle[ds];
  }

  getDeviceTypeList(): string[] {
    return Object.keys(DeviceType).filter(key => isNaN(Number(DeviceType[key])));  
  }

  getDeviceType(dt) {
    return DeviceType[dt];
  }

  clearAll() {
    this.commandObs$.next(new DrawCommand(CommandType.CLEAR_ALL));
  }

  clearBg() {
    this.commandObs$.next(new DrawCommand(CommandType.CLEAR_BG));
  }

  clearFg() {
    this.commandObs$.next(new DrawCommand(CommandType.CLEAR_FG));
  }

  setBgImage(files) {
    if(files && files[0]) {
      // check if img
      if(files[0].type.match('image/(jpeg|png|jpg)')) {
        const img = new Image();
        img.width = this.width;
        img.height = this.height; 
        img.src = URL.createObjectURL(files[0]);
        this.bgImg = img;
      }
    }
  }

  changeFill(checked) {
    this.fillShape = checked;
  }

  changeEraser(checked) {
    this.eraser = checked;
  }

  changeRandom(checked) {
    this.randomColor = checked;
  }

  processResult(res: string) {
    const link = document.createElement("a");
    link.setAttribute("href", res);
    link.setAttribute("download", (new Date()).toUTCString());
    link.click();
  }

  exportNow() {
    this.commandObs$.next(new DrawCommand(CommandType.EXPORT));
  }

  generateRandomColor() {
    let color = '#';
    const seed = '0123456789ABCDEF';
    for(let i = 0; i < 6; i++) {
      color += seed[Math.floor(Math.random() * seed.length)]
    }
    return color;
  }

  getColor() {
    if(this.randomColor) {
      return this.generateRandomColor();
    } else {
      return this.lineColor;
    }
  }

  processError(error) {
    console.log(error);
  }
}
