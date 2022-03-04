import { linkSync } from 'fs';
import {Point,Line,LineType,Rectangle,Form, Triangle} from './forms';


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

class Render {
    constructor () {
        console.clear();
    }

    private setCursor(point: Point) {
        process.stdout.write(`\u001b[${point.x};${point.y}H`);  
    }

    renderPoint(point: Point, color = Colors.White,  character = '█',) {
        this.setCursor(point);
        process.stdout.write(color + character + Colors.Reset);
    }

    renderLine(line: Line, color = Colors.White) {
        const points = line.getPoints();
        points.forEach(point => this.renderPoint(point,color));
    }

    renderForm(form: Form, color = Colors.White) {
        const lines = form.getLines();
        lines.forEach(line => this.renderLine(line,color));
    }

    renderText(text: string, point: Point, color = Colors.White) {
        this.setCursor(point);
        process.stdout.write(color + text + Colors.Reset);
    }
}

const render = new Render();
render.renderForm(new Rectangle(new Point(0,0),100,100,true), Colors.White);

function spainFlag() {
    render.renderForm(new Rectangle(new Point(2, 5),20,8,true), Colors.Red);
    render.renderForm(new Rectangle(new Point(4, 5),20,4,true), Colors.Yellow);

}

function ukranieFlag() {
    render.renderForm(new Rectangle(new Point(2, 5),20,3,true), Colors.Blue);
    render.renderForm(new Rectangle(new Point(6, 5),20,3,true), Colors.Yellow);
}



spainFlag();

// render.renderForm(new Triangle(new Point(2, 30), new Point(11, 30), new Point(2, 50), true));



// wait for user input
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', () => process.exit());