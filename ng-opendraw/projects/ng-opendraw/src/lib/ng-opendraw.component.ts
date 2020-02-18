import { Component, OnInit, ViewChild, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { DrawCommand } from './models/draw-command';
import { DeviceType } from './models/device-type';
import { DrawStyle } from './models/draw-style';
import { CommandType } from './models/command-type';

@Component({
  selector: 'ng-opendraw',
  templateUrl: './ng-opendraw.component.html',
  styleUrls: ['./ng-opendraw.component.css']
})
export class NgOpendrawComponent implements OnInit {

  private _canHeight: number = 500;

  @Input()
  public set canHeight(v: number) {
    if(this.ctxFg) {
      this.ctxFg.save();
    }
    this._canHeight = v;   
    if(this.ctxFg) {
      this.ctxFg.restore();
    }
  }

  public get canHeight() {
    return this._canHeight;
  }

  private _canWidth: number = 500;

  @Input()
  public set canWidth(v: number) {
    if(this.ctxFg) {
      this.ctxFg.save();
    }
    this._canWidth = v;
    if(this.ctxFg) {
      this.ctxFg.restore();
    }
  }

  public get canWidth() {
    return this._canWidth;
  }

  private _lineColor: string = 'black';

  @Input()
  public set lineColor(v: string) {
    this._lineColor = v;
  }

  public get lineColor() {
    return this._lineColor;
  }

  private _lineWidth: number = 3;

  @Input()
  public set lineWidth(v: number) {
    this._lineWidth = v;
  }

  public get lineWidth() {
    return this._lineWidth;
  }

  private _fillShape: boolean = false;

  @Input()
  public set fillShape(v: boolean) {
    this._fillShape = v;
  }

  public get fillShape() {
    return this._fillShape;
  }

  private _drawStyle: DrawStyle = DrawStyle.NORMAL;

  @Input()
  public set drawStyle(v: DrawStyle) {
      this._drawStyle = v;
  }

  public get drawStyle() {
    return Number(this._drawStyle);
  }

  private _eraser: boolean = false;

  @Input()
  public set eraser(v: boolean) {
    this._eraser = v;
  }

  public get eraser() {
    return this._eraser;
  }

  private _allowedDeviceType: DeviceType = DeviceType.ALL;

  @Input()
  public set allowedDeviceType(v: DeviceType) {
    this._allowedDeviceType = v;
  }

  public get allowedDeviceType() {
    return this._allowedDeviceType;
  }

  private _backgroundImage: HTMLImageElement = null;

  @Input()
  public set backgroundImage(v: HTMLImageElement) {
    if(v !== null) {
      this._backgroundImage = v;
      if(this.canvasLoaded) {
        v.onload = () => this.drawBackgroundImage()
      } else {
        this.canvasLoaded$.subscribe(
          () => {
            v.onload = () => this.drawBackgroundImage()
          }
        )
      }
    }
  }

  public get backgroundImage() {
    return this._backgroundImage;
  }

  private _backgroundColor: string = null;

  @Input()
  public set backgroundColor(v: string){
    this._backgroundColor = v;
    if(this.canvasLoaded) {
      this.drawBackground();
    } else {
      this.canvasLoaded$.subscribe(
        () => {
          this.drawBackground();
        }
      )
    }

  }

  public get backgroundColor() {
    return this._backgroundColor;
  }

  private _commandObs$: Observable<DrawCommand>;

  @Input()
  public set commandObs(v: Observable<DrawCommand>) {
    this._commandObs$ = v;
    this._commandObs$.subscribe(
      (cmd) => this.handleCommand(cmd)
    )
  }

  @Output()
  readonly outputEvent: EventEmitter<any> = new EventEmitter<string>();

  @Output()
  readonly errorEvent: EventEmitter<any> = new EventEmitter<string>();

  @ViewChild('foreground', {static : true})
  canvasFg: ElementRef<HTMLCanvasElement>;
  @ViewChild('background', {static: true})
  canvasBg: ElementRef<HTMLCanvasElement>;

  private ctxFg: CanvasRenderingContext2D;
  private ctxBg: CanvasRenderingContext2D;

  private canvasLoaded$: Subject<void> = new Subject();
  private canvasLoaded: boolean = false;
  private drawingActive = false;
  private lastPointerX: number;
  private lastPointerY: number;

  // TODO : active layer : default last
  // TODO : number of layers : min 2
  
  constructor() {
    // TODO: create 2 default layers bg and fg
  }

  ngOnInit() {
    if (this.canvasFg.nativeElement.getContext) {
      this.ctxFg = this.canvasFg.nativeElement.getContext('2d');
      this.ctxBg = this.canvasBg.nativeElement.getContext('2d');
      this.canvasLoaded$.next();
      this.canvasLoaded = true;
      this.canvasLoaded$.complete();
    } else {
      // canvas-unsupported
      // console.log('Canvas unsupported in your browser');
      this.errorEvent.emit('Canvas unsupported in your browser');
    }
  }

  handleDeviceDrawing(event) {
    event.preventDefault();
    let deviceType = "mouse";
    if(event.pointerType) {
      deviceType = event.pointerType;
    }
    if(!deviceType.match(this._allowedDeviceType)) {
      return;
    }
    switch(event.pointerType) {
      case 'mouse':
      case 'touch':
        switch (event.type) {
          case 'pointermove':
            if(this.drawStyle === DrawStyle.NORMAL) {
              if(this.drawingActive) {
                this.draw(event.offsetX, event.offsetY);
              }
            }
          break;
          case 'pointerup':
            if(this.drawStyle === DrawStyle.ELLIPSE || this.drawStyle === DrawStyle.CIRCLE || this.drawStyle === DrawStyle.LINE || this.drawStyle === DrawStyle.RECTANGLE) {
              this.draw(event.offsetX, event.offsetY);
            }
            this.drawingActive = false;
            this.lastPointerX = null;
            this.lastPointerY = null;
          break;
          case 'pointerdown':
            this.drawingActive = true;
            this.lastPointerX = event.offsetX; 
            this.lastPointerY = event.offsetY;
            if(this.drawStyle === DrawStyle.NORMAL) {
              this.draw(event.offsetX, event.offsetY);
            }
          break;
          case 'pointerleave':
            if(this.drawStyle === DrawStyle.ELLIPSE || this.drawStyle === DrawStyle.CIRCLE || this.drawStyle === DrawStyle.LINE || this.drawStyle === DrawStyle.RECTANGLE) {
              this.draw(event.offsetX, event.offsetY);
            }
            this.drawingActive = false;
            this.lastPointerX = null;
            this.lastPointerY = null;
          break;
          case 'pointerout':
            if(this.drawStyle === DrawStyle.ELLIPSE || this.drawStyle === DrawStyle.CIRCLE || this.drawStyle === DrawStyle.LINE || this.drawStyle === DrawStyle.RECTANGLE) {
              this.draw(event.offsetX, event.offsetY);
            }
            this.drawingActive = false;
            this.lastPointerX = null;
            this.lastPointerY = null;
          break;
        }  
      break;
      case 'pen':
        switch (event.type) {
          case 'pointermove':
            if(this.drawStyle === DrawStyle.NORMAL) {
              if(this.drawingActive) {
                this.draw(event.offsetX, event.offsetY);
              }
            }
          break;
          case 'pointerdown':
            this.drawingActive = true;
            this.lastPointerX = event.offsetX; 
            this.lastPointerY = event.offsetY;
            if(this.drawStyle === DrawStyle.NORMAL) {
              this.draw(event.offsetX, event.offsetY);
            }
          break;
          case 'pointerup':
          case 'panend':
            if(this.drawStyle === DrawStyle.ELLIPSE || this.drawStyle === DrawStyle.CIRCLE || this.drawStyle === DrawStyle.LINE || this.drawStyle === DrawStyle.RECTANGLE) {
              this.draw(event.srcEvent.offsetX, event.srcEvent.offsetY);
            }
            this.drawingActive = false;
            this.lastPointerX = null;
            this.lastPointerY = null;
          break;
        }
      break;
    }
  }

  private draw(x: number, y: number) {
    if(this.lastPointerX && this.lastPointerY) {
      this.ctxFg.beginPath();
      if(this._eraser) {
        this.ctxFg.save();
        this.ctxFg.globalCompositeOperation = "destination-out";
        this.ctxFg.strokeStyle = "rgba(0,0,0,1)";
        this.ctxFg.fillStyle = "rgba(0,0,0,1)";
      } else {
        this.ctxFg.strokeStyle = this._lineColor;
        this.ctxFg.fillStyle = this._lineColor;
      }
      this.ctxFg.lineWidth = this._lineWidth;
      this.ctxFg.lineCap = "round";
      this.ctxFg.lineJoin = "round";
      if(this.drawStyle === DrawStyle.NORMAL || this.drawStyle === DrawStyle.LINE) {
        this.ctxFg.moveTo(this.lastPointerX, this.lastPointerY);
        this.ctxFg.lineTo(x, y);
      } else if(this.drawStyle === DrawStyle.RECTANGLE) {
        let startX, startY, endX, endY;
        if(this.lastPointerX < x) {
          startX = this.lastPointerX;
          endX = x - startX;
        } else {
          startX = x;
          endX = this.lastPointerX - startX;
        }
        if(this.lastPointerY < y) {
          startY = this.lastPointerY;
          endY = y - startY;
        } else {
          startY = y;
          endY = this.lastPointerY - startY;
        }
        this.ctxFg.rect(startX, startY, endX, endY);
      } else if(this.drawStyle === DrawStyle.CIRCLE) {
        let radius = Math.pow(Math.abs(y - this.lastPointerY), 2);
        radius += Math.pow(Math.abs(x - this.lastPointerX), 2);
        radius = Math.sqrt(radius);
        this.ctxFg.arc(this.lastPointerX, this.lastPointerY, radius, 0, 2 * Math.PI);
      }else if(this.drawStyle === DrawStyle.ELLIPSE) {
        this.ctxFg.ellipse(this.lastPointerX, this.lastPointerY, Math.abs(x - this.lastPointerX), Math.abs(y - this.lastPointerY), Math.PI * .25, 0, Math.PI * 2);
      }
      if(this.fillShape && (this.drawStyle === DrawStyle.ELLIPSE || this.drawStyle === DrawStyle.CIRCLE || this.drawStyle === DrawStyle.RECTANGLE)) {
        this.ctxFg.fill();
      }else {
        this.ctxFg.stroke();
      }
      this.ctxFg.closePath();
      if(this._eraser) {
        this.ctxFg.restore();
      }
    }
    this.lastPointerX = x; 
    this.lastPointerY = y;
  }

  private clear(ctx: CanvasRenderingContext2D, sx: number = 0, sy: number = 0, dx: number = this._canWidth, dy: number = this._canHeight) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(sx, sy, dx, dy);
  }

  private drawBackground() {
    if(this._backgroundColor !== null) {
      this.ctxBg.beginPath();
      this.ctxBg.fillStyle = this._backgroundColor;
      this.ctxBg.fillRect(0, 0, this._canWidth, this._canHeight);
      this.ctxBg.closePath();
      this.ctxBg.stroke();
    }
  }

  private drawBackgroundImage() {
    if(this._backgroundImage !== null) {
      this.ctxBg.drawImage(this._backgroundImage, 0, 0, this._canWidth, this._canHeight);
    }
  }

  private exportCanvas(sx: number = 0, sy: number = 0, dx: number = this._canWidth, dy: number = this._canHeight) {
    if(sx >= 0 && sy >=0 && sx <= this._canWidth && sy <= this._canHeight
      && dx >= 0 && dy >= 0 && dx <= this._canWidth && dy <= this._canHeight && sx < dx && sy < dy) {
        const can = document.createElement('canvas');
        can.width = dx - sx;
        can.height = dy - sy;
        const ctx: CanvasRenderingContext2D = can.getContext('2d');
        // background
        ctx.drawImage(this.canvasBg.nativeElement, sx, sy, dx, dy);
        // foreground
        ctx.drawImage(this.canvasFg.nativeElement, sx, sy, dx, dy);
        this.outputEvent.emit(can.toDataURL('image/png',1));
    }
  }

  private handleCommand(cmd: DrawCommand) {
    let sx = 0, sy = 0, dx = this._canWidth, dy = this._canHeight;
    if(cmd.parameters !== null) {
      if(cmd.parameters.sx !== null && cmd.parameters.sy != null) {
        sx = cmd.parameters.sx;
        sy = cmd.parameters.sy;
      }else if(cmd.parameters.dx !== null && cmd.parameters.dy !== null) {
        dx = cmd.parameters.dx;
        dy = cmd.parameters.dy;
      } else if(cmd.parameters.dx !== null && cmd.parameters.dy !== null && cmd.parameters.sx !== null && cmd.parameters.sy !== null) {
        sx = cmd.parameters.sx;
        sy = cmd.parameters.sy;
        dx = cmd.parameters.dx;
        dy = cmd.parameters.dy;
      }
    }
    switch(cmd.type) {
      case CommandType.CLEAR_ALL:
        this.clear(this.ctxBg, sx, sy, dx, dy);
        this.clear(this.ctxFg, sx, sy, dx, dy);
      case CommandType.CLEAR_BG:
        this.clear(this.ctxBg, sx, sy, dx, dy);
      break;
      case CommandType.CLEAR_FG:
        this.clear(this.ctxFg, sx, sy, dx, dy);
      break;
      case CommandType.EXPORT:
        this.exportCanvas(sx, sy, dx, dy);
      break;
    }
  }

}
