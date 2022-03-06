import { linkSync } from 'fs';
import {Point,Line,LineType,Rectangle,Shape, Circle} from './Shapes';
import * as readLine from 'readline';

enum Colors {
    Black = "\x1b[30m",
    Red = "\x1b[31m",
    Green = "\x1b[32m",
    Yellow = "\x1b[33m",
    Blue = "\x1b[34m",
    Magenta = "\x1b[35m",
    Cyan = "\x1b[36m",
    White = "\x1b[37m",
    Default = "\x1b[39m",
    Reset = "\x1b[0m"

}

export class InputHandler {
    
    

    static getInput(callback: (input: string) => void): void {
        readLine.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('keypress', (character,key) => {
            callback(key.name);
        });
    }
}

export class Renderer {
    constructor () {
        console.clear();
    }

    private setCursor(point: Point) {
        process.stdout.write(`\u001b[${point.x};${point.y}H`);  
    }

    private colorHexToEsc(color: string) {
        color = color.toLowerCase();
        switch (color) {
            case '#000000':
            case 'black':
                return Colors.Black;
            case '#ff0000':
            case 'red':
                return Colors.Red;
            case '#00ff00':
            case 'green':
                return Colors.Green;
            case '#ffff00':
            case 'yellow':
                return Colors.Yellow;
            case '#0000ff':
            case 'blue':
                return Colors.Blue;
            case '#ff00ff':
            case 'magenta':
                return Colors.Magenta;
            case '#00ffff':
            case 'cyan':
                return Colors.Cyan;
            case '#ffffff':
            case 'white':
                return Colors.White;
            case 'default':
                return Colors.Default;
            case 'reset':
                return Colors.Reset;
        }
    }

    renderPoint(point: Point, color = Colors.White, character = '█',) {
        this.setCursor(point);
        process.stdout.write(color + character + Colors.Reset);
    }

    renderLine(line: Line, color = Colors.White) {
        const points = line.getPoints();
        points.forEach(point => this.renderPoint(point,color));
    }

    renderShape(shape: Shape) {
        const lines = shape.getLines();
        lines.forEach(line => this.renderLine(line,this.colorHexToEsc(shape.color)));
        shape.children.forEach(child => this.renderShape(child));
    }

    renderText(text: string, point: Point, color = Colors.White) {
        this.setCursor(point);
        process.stdout.write(color + text + Colors.Reset);
    }

    public clear() {
        console.clear();
    }
}
