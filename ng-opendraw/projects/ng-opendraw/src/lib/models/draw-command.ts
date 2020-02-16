import { CommandType } from './command-type';

export class DrawCommand {
    constructor(public type: CommandType, public parameters: CommandZone = null) {}
}

export class CommandZone {
    constructor(public sx:number = null, public sy:number = null, public dx:number = null, public dy:number = null){}
}