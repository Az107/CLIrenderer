export class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    sumPoint(point: Point) {
        return new Point(this.x + point.x, this.y + point.y);
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


export interface Shape {
    getLines(): Line[];
    isFilled: boolean;
    children: Shape[];
    position: Point;
    color: string;

}

export class Rectangle implements Shape {
    position: Point;
    height: number;
    width: number;
    isFilled: boolean = false;
    children: Shape[];
    color: string;

    addChild(child: Shape) {
        child.position = child.position.sumPoint(this.position);
        this.children.push(child);
    }


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
        this.position = position;
        this.height = height;
        this.width = width;
        this.isFilled = isFilled;
        this.children = [];
        this.color = color;
    }

}

export class Triangle implements Shape {
    position = new Point(0, 0);
    a: Point;
    b: Point;
    c: Point;
    isFilled: boolean = false;
    children: Shape[];
    color: string;

    addChild(child: Shape) {
        
        this.children.push(child);
    }

    
    getLines(): Line[] {
        const lines: Line[] = [];
        this.a = this.a.sumPoint(this.position);
        this.b = this.b.sumPoint(this.position);
        this.c = this.c.sumPoint(this.position);
        lines.push(new Line(this.a, this.b));
        lines.push(new Line(this.b, this.c));
        lines.push(new Line(this.c, this.a));
        if (this.isFilled) {
            
        }
        return lines;
    }


    constructor(a: Point, b: Point, c: Point,color = "white", isFilled = false) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.isFilled = isFilled;
        this.children = [];
        this.color = color;


    }
}



