import P5 from 'p5';
import { cos, Matrix, Vector, sin } from './Math';
import { Mesh } from './Mesh';
import sphereMesh from './spheremesh';
export class MeshObject {
  public pos: number[];
  public meshes: number[][][] = [];
  public reflectRate: number[] | undefined;
  public isTransparent: boolean | undefined;
  public transparentRate: number[] | undefined;
  public isMirror: boolean | undefined;
  public mirroringRate: number[] | undefined;
  constructor(
    pos: number[],
    reflectRate?: number[],
    isTransparent?: boolean,
    transparentRate?: number[],
    isMirror?: boolean,
    mirroringRate?: number[]
  ) {
    this.pos = pos;
    this.reflectRate = reflectRate;
    this.isTransparent = isTransparent;
    this.transparentRate = transparentRate;
    this.isMirror = isMirror;
    this.mirroringRate = mirroringRate;
  }

  addMesh(pos: number[], edge1: number[], edge2: number[]): void {
    this.meshes.push([pos, edge1, edge2]);
  }
  protected getMappedPos(p5: P5): number[] {
    return [this.pos[0] / 2, p5.height - this.pos[1] / 2];
  }
  draw(p5: P5) {
    if (this.reflectRate)
      p5.fill(
        255 * this.reflectRate[0],
        255 * this.reflectRate[1],
        255 * this.reflectRate[2]
      );
    else p5.fill(255);
    p5.noStroke();
  }
  toMeshesList(p5: P5): Mesh[] {
    const ans: Mesh[] = [];
    for (let mesh of this.meshes) {
      ans.push(
        new Mesh(
          P5.Vector.add(
            p5.createVector(this.pos[0], this.pos[1], this.pos[2]),
            p5.createVector(mesh[0][0], mesh[0][1], mesh[0][2])
          ),
          p5.createVector(mesh[1][0], mesh[1][1], mesh[1][2]),
          p5.createVector(mesh[2][0], mesh[2][1], mesh[2][2]),
          this.reflectRate,
          this.isTransparent,
          this.transparentRate,
          this.isMirror,
          this.mirroringRate
        )
      );
    }
    return ans;
  }
  rotateZ(deg: number) {
    const rotationMat = new Matrix([
      [cos(deg), -sin(deg), 0],
      [sin(deg), cos(deg), 0],
      [0, 0, 1],
    ]);
    for (let mesh of this.meshes) {
      for (let vector of mesh) {
        const rotated = new Vector(...vector).mul(rotationMat);
        vector[0] = rotated.x;
        vector[1] = rotated.y;
        vector[2] = rotated.z;
      }
    }
    return this;
  }

  rotateY(deg: number) {
    const rotationMat = new Matrix([
      [cos(deg), 0, sin(deg)],
      [0, 1, 0],
      [-sin(deg), 0, cos(deg)],
    ]);
    for (let mesh of this.meshes) {
      for (let vector of mesh) {
        const rotated = new Vector(...vector).mul(rotationMat);
        vector[0] = rotated.x;
        vector[1] = rotated.y;
        vector[2] = rotated.z;
      }
    }
    return this;
  }
  rotateX(deg: number) {
    const rotationMat = new Matrix([
      [1, 0, 0],
      [0, cos(deg), -sin(deg)],
      [0, sin(deg), cos(deg)],
    ]);
    for (let mesh of this.meshes) {
      for (let vector of mesh) {
        const rotated = new Vector(...vector).mul(rotationMat);
        vector[0] = rotated.x;
        vector[1] = rotated.y;
        vector[2] = rotated.z;
      }
    }
    return this;
  }
}
export class Cube extends MeshObject {
  width: number;
  constructor(
    width: number,
    pos: number[],
    reflectRate?: number[],
    isTransparent?: boolean,
    transparentRate?: number[],
    isMirror?: boolean,
    mirroringRate?: number[]
  ) {
    super(
      pos,
      reflectRate,
      isTransparent,
      transparentRate,
      isMirror,
      mirroringRate
    );
    this.width = width;
    [
      [
        [-width / 2, -width / 2, -width / 2],
        [width, 0, 0],
        [0, 0, width],
      ],
      [
        [width / 2, -width / 2, width / 2],
        [-width, 0, 0],
        [0, 0, -width],
      ],
      [
        [width / 2, -width / 2, -width / 2],
        [0, width, 0],
        [0, 0, width],
      ],
      [
        [width / 2, width / 2, width / 2],
        [0, -width, 0],
        [0, 0, -width],
      ],
      [
        [width / 2, width / 2, -width / 2],
        [-width, 0, 0],
        [0, 0, width],
      ],
      [
        [-width / 2, width / 2, width / 2],
        [width, 0, 0],
        [0, 0, -width],
      ],
      [
        [-width / 2, width / 2, -width / 2],
        [0, -width, 0],
        [0, 0, width],
      ],
      [
        [-width / 2, -width / 2, width / 2],
        [0, width, 0],
        [0, 0, -width],
      ],
      [
        [-width / 2, -width / 2, -width / 2],
        [width, 0, 0],
        [0, width, 0],
      ],
      [
        [width / 2, width / 2, -width / 2],
        [-width, 0, 0],
        [0, -width, 0],
      ],
      [
        [-width / 2, -width / 2, width / 2],
        [width, 0, 0],
        [0, width, 0],
      ],
      [
        [width / 2, width / 2, width / 2],
        [-width, 0, 0],
        [0, -width, 0],
      ],
    ].forEach((mesh) => this.addMesh(mesh[0], mesh[1], mesh[2]));
  }
  override draw(p5: P5) {
    super.draw(p5);
    p5.rect(
      this.getMappedPos(p5)[0] - this.width / 2,
      this.getMappedPos(p5)[1] + this.width / 4,
      this.width,
      this.width
    );
  }
}
export class Sphere extends MeshObject {
  radius: number;
  constructor(
    radius: number,
    pos: number[],
    reflectRate?: number[],
    isTransparent?: boolean,
    transparentRate?: number[],
    isMirror?: boolean,
    mirroringRate?: number[]
  ) {
    super(
      pos,
      reflectRate,
      isTransparent,
      transparentRate,
      isMirror,
      mirroringRate
    );
    this.radius = radius;
    sphereMesh.forEach((mesh) =>
      this.addMesh(
        mesh[0].map((a) => a * radius),
        mesh[1].map((a) => a * radius),
        mesh[2].map((a) => a * radius)
      )
    );
  }
  override draw(p5: P5) {
    super.draw(p5);
    p5.ellipse(
      this.getMappedPos(p5)[0],
      this.getMappedPos(p5)[1],
      this.radius * 2
    );
  }
}

export class Ground extends MeshObject {
  constructor(
    length: number,
    width: number,
    pos: number[],
    reflectRate?: number[],
    isTransparent?: boolean,
    transparentRate?: number[],
    isMirror?: boolean,
    mirroringRate?: number[]
  ) {
    super(
      pos,
      reflectRate,
      isTransparent,
      transparentRate,
      isMirror,
      mirroringRate
    );
    [
      [
        [-length / 2, -width / 2, 0],
        [length, 0, 0],
        [0, width, 0],
      ],
      [
        [length / 2, width / 2, 0],
        [-length, 0, 0],
        [0, -width, 0],
      ],
    ].forEach((mesh) => this.addMesh(mesh[0], mesh[1], mesh[2]));
  }
  override draw() {}
}
