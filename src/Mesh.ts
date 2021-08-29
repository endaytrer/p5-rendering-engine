import P5 from 'p5';
export class Mesh {
  public pos: P5.Vector;
  public tan1: P5.Vector;
  public tan2: P5.Vector;
  public reflectingRate: number[]; // 反射率
  public isTransparent;
  public transparentRate: number[];
  constructor(
    pos: P5.Vector,
    line: P5.Vector,
    height: P5.Vector,
    reflectingRate = [1, 1, 1],
    isTransparent = false,
    transparentRate = [0, 0, 0]
  ) {
    this.pos = pos;
    this.tan1 = line;
    this.tan2 = height;
    this.reflectingRate = reflectingRate;
    this.isTransparent = isTransparent;
    this.transparentRate = transparentRate;
  }
  getNormalVector() {
    return this.tan1.cross(this.tan2).normalize();
  }
}
