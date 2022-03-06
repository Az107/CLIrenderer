export class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    addPoint(point: Point) {
        return new Point(this.x + point.x, this.y + point.y);
    }

    subPoint(point: Point) {
        return new Point(this.x - point.x, this.y - point.y);
    }


}

export enum LineType {
    Horizontal,
    Vertical,
    Diagonal
}

export class Line {
    start: Point;
    end: Point;
    getType(): LineType {
        if (this.start.x === this.end.x) {
            return LineType.Vertical;
        }
        if (this.start.y === this.end.y) {
            return LineType.Horizontal;
        }
        return LineType.Diagonal;
    }

    getPoints(): Point[] {
        const points: Point[] = [];
        let y0 = this.start.y;
        let x0 = this.start.x;
        let x1 = this.end.x;
        let y1 = this.end.y;
        let dx = Math.abs(x1 - x0);   
        let dy = Math.abs(y1 - y0);
        let sx = (x0 < x1) ? 1 : -1;
        let sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;
        while (true) {
            points.push(new Point(x0, y0));
            if (x0 === x1 && y0 === y1) {
                break;
            }
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
        return points;
    }

    constructor(start: Point, end: Point) {
        this.start = start;
        this.end = end;
    }

}


interface IShape {
    getLines(): Line[];
    isFilled: boolean;
    children: IShape[];
    position: Point;
    color: string;
    refresh(): void;
    addChild(shape: IShape): void;

}

export class Shape implements IShape {
    addChild(child: Shape) {
        child.position = child.position.addPoint(this.position);
        child.refresh();
        this.children.push(child);
    }

    refresh() {
        this.children.forEach(child => {
            child.position = child.position.addPoint(this.position.subPoint(new Point(1, 1)));
            child.refresh()
        });
    }

    getLines(): Line[] {
        throw new Error("Method not implemented.");
    }
    isFilled: boolean;
    children: IShape[];
    position: Point;
    color: string;


    constructor(position: Point, color: string, isFilled: boolean) {
        this.position = position;
        this.color = color;
        this.isFilled = isFilled;
        this.children = [];
    }
    
}





export class Rectangle extends Shape {
    height: number;
    width: number;

    getLines(): Line[] {
        const lines: Line[] = [];
        lines.push(new Line(new Point(this.position.x, this.position.y), new Point(this.position.x + this.height, this.position.y)));
        lines.push(new Line(new Point(this.position.x + this.height, this.position.y), new Point(this.position.x + this.height, this.position.y + this.width)));
        lines.push(new Line(new Point(this.position.x + this.height, this.position.y + this.width), new Point(this.position.x, this.position.y + this.width)));
        lines.push(new Line(new Point(this.position.x, this.position.y + this.width), new Point(this.position.x, this.position.y)));
        if (this.isFilled) {
            for (let i = this.position.x; i < this.position.x + this.height; i++) {
                for (let j = this.position.y; j < this.position.y + this.width; j++) {
                    lines.push(new Line(new Point(i, j), new Point(i + 1, j + 1)));
                }
            }
        }
        return lines;
    }
    
    constructor(position: Point, width: number, height: number,color = "white", isFilled = false) {
        super(position, color, isFilled);
        this.height = height;
        this.width = width;
    }

}

export class Triangle extends Shape {
    a: Point;
    b: Point;
    c: Point;
    
    getLines(): Line[] {
        const lines: Line[] = [];
        this.a = this.a.addPoint(this.position);
        this.b = this.b.addPoint(this.position);
        this.c = this.c.addPoint(this.position);
        lines.push(new Line(this.a, this.b));
        lines.push(new Line(this.b, this.c));
        lines.push(new Line(this.c, this.a));
        if (this.isFilled) {

        }
        return lines;
    }

    constructor(a: Point, b: Point, c: Point,color = "white", isFilled = false) {
        super(new Point(0, 0), color, isFilled);
        this.a = a;
        this.b = b;
        this.c = c;
        this.children = [];

    }
}

export class Circle extends Shape {
    children: Shape[];
    radius: number;
    diameter: number;
    
    getLines(): Line[] {
        const lines: Line[] = [];
        let initPoint = new Point(this.position.x, this.position.y);
        for (let i = 0; i < this.radius; i++) {
            initPoint.x++;
            let ix = Math.trunc((this.radius - i) / 2);
            let iy = Math.trunc((this.diameter - i) / 2);

            const iPoint = new Point(initPoint.x + ix , initPoint.y + iy);
            const jPoint = new Point(initPoint.x + ix , initPoint.y + iy + i + 1 );
            const line = new Line(iPoint, jPoint);
            lines.push(line);
        }
        for (let i = 1; i < this.radius; i++) {
            let ix = Math.trunc((this.radius - i) / 2);
            let iy = Math.trunc((this.diameter - i) / 2);

            const iPoint = new Point(initPoint.x + ix , initPoint.y + iy);
            const jPoint = new Point(initPoint.x + ix , initPoint.y + iy + i);
            const line = new Line(iPoint, jPoint);
            lines.push(line);
             
        }

        return lines;
    }


    constructor(radius: number,position: Point, color: string, isFilled: boolean) {
        super(position, color, isFilled);
        this.children = [];
        this.radius = radius;
        this.diameter = radius * 2;
    }
    

}


// export class Text extends Shape {

//     text: string;
//     constructor(position: Point, text: string, color: string) {
//         super(position, color, false);
//         this.children = [];
//         this.text = text;
//     }
// }


