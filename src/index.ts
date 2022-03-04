import { linkSync } from 'fs';
import {Point,Line,LineType,Rectangle,Shape, Triangle} from './Shapes';


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

class InputHandler {
    

    static getInput() {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', () => process.exit());
    }
}

class Render {
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

    renderForm(shape: Shape) {
        const lines = shape.getLines();
        lines.forEach(line => this.renderLine(line,this.colorHexToEsc(shape.color)));
        shape.children.forEach(child => this.renderForm(child));
    }

    renderText(text: string, point: Point, color = Colors.White) {
        this.setCursor(point);
        process.stdout.write(color + text + Colors.Reset);
    }
}

const render = new Render();

let rectangle = new Rectangle(new Point(1,1),20,10,"Green",true);
let rectangle2 = new Rectangle(new Point(1,1),11,6);
let triangle = new Triangle(new Point(1,1),new Point(5,1),new Point(1,6),"Blue");
let triangle2 = new Triangle(new Point(1,10),new Point(5,10),new Point(5,5),"Blue");

rectangle.addChild(rectangle2);
rectangle2.addChild(triangle);
rectangle2.addChild(triangle2);
render.renderForm(rectangle);


// render.renderForm(new Triangle(new Point(2, 30), new Point(11, 30), new Point(2, 50), true));


InputHandler.getInput();
// wait for user input
