/**
 * Created by tommyZZM on 2015/5/19.
 */
declare module SAT {

    export class Vector {
        constructor(x: number, y: number);

        x: number;
        y: number;

        copy(other: Vector);
        clone(): Vector;
        perp();
        rotate(angle: number);
        reverse();
        normalize();
        add(other: Vector);
        sub(other: Vector);
        scale(x: number, y: number);
        project(other: Vector);
        projectN(other: Vector);
        reflect(axis: Vector);
        reflectN(axis: Vector);
        dot(other: Vector);
        len2(): number;
        len(): number;
    }
    export class Circle {
        constructor(pos: Vector, r: number);

        pos: Vector;
        r: number;
    }
    export class Polygon {
        constructor(pos: Vector, points: Vector[]);

        pos: Vector;
        points: Vector[];
        angle: number;
        offset: Vector;
        calcPoints: Vector[];
        edges: Vector[];
        normals: Vector[];

        setPoints(points: Vector[]);
        setAngle(angle: number);
        setOffset(offset: Vector);
        recalc();
        rotate(angle: number);
        translate(x: number, y: number);

    }
    export class Box {
        constructor(pos: Vector, width: number, height: number);

        pos: Vector;
        w: number;
        h: number;

        toPolygon(): Polygon;
    }
    export class Response {
        constructor();

        a: any;
        b: any;
        overlap: number;
        overlapN: Vector;
        overlapV: Vector;
        aInB: boolean;
        bInA: boolean;

        clear();
    }

    export function pointInCircle(p: Vector, c: Circle): boolean;
    export function pointInPolygon(p: Vector, poly: Polygon): boolean;
    export function testCircleCircle(a: Circle, b: Circle, response?: Response): boolean;
    export function testPolygonCircle(polygon: Polygon, circle: Circle, response?: Response): boolean;
    export function testCirclePolygon(circle: Circle, polygon: Polygon, response?: Response): boolean;
    export function testPolygonPolygon(a: Polygon, b: Polygon, response?: Response): boolean;

}