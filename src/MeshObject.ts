import P5 from 'p5';
import { Mesh } from './Mesh';
import sphereMesh from './spheremesh';
export class MeshObject {
  public pos: number[];
  public meshes: number[][][] = [];
  public reflectRate: number[];
  public isTransparent: boolean;
  public transparentRate: number[];
  constructor(
    pos: number[],
    reflectRate = [1, 1, 1],
    isTransparent = false,
    transparentRate = [0, 0, 0]
  ) {
    this.pos = pos;
    this.reflectRate = reflectRate;
    this.isTransparent = isTransparent;
    this.transparentRate = transparentRate;
  }
  addMesh(pos: number[], edge1: number[], edge2: number[]): void {
    this.meshes.push([pos, edge1, edge2]);
  }
  draw(p5: P5) {
    p5.fill(255);
    p5.noStroke();
    p5.rect(this.pos[0] / 2, 150 - this.pos[1] / 2, 8, 8);
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
          this.transparentRate
        )
      );
    }
    return ans;
  }
}
export function Cube(
  width: number,
  pos: number[],
  reflectingRate?: number[],
  isTransparent?: boolean,
  transparentRate?: number[]
): MeshObject {
  const ans = new MeshObject(
    pos,
    reflectingRate,
    isTransparent,
    transparentRate
  );
  [
    [
      [0, 0, 0],
      [width, 0, 0],
      [0, 0, width],
    ],
    [
      [width, 0, width],
      [-width, 0, 0],
      [0, 0, -width],
    ],
    [
      [width, 0, 0],
      [0, width, 0],
      [0, 0, width],
    ],
    [
      [width, width, width],
      [0, -width, 0],
      [0, 0, -width],
    ],
    [
      [width, width, 0],
      [-width, 0, 0],
      [0, 0, width],
    ],
    [
      [0, width, width],
      [width, 0, 0],
      [0, 0, -width],
    ],
    [
      [0, width, 0],
      [0, -width, 0],
      [0, 0, width],
    ],
    [
      [0, 0, width],
      [0, width, 0],
      [0, 0, -width],
    ],
    [
      [0, 0, 0],
      [width, 0, 0],
      [0, width, 0],
    ],
    [
      [width, width, 0],
      [-width, 0, 0],
      [0, -width, 0],
    ],
    [
      [0, 0, width],
      [width, 0, 0],
      [0, width, 0],
    ],
    [
      [width, width, width],
      [-width, 0, 0],
      [0, -width, 0],
    ],
  ].forEach((mesh) => ans.addMesh(mesh[0], mesh[1], mesh[2]));
  return ans;
}
export function Sphere(
  radius: number,
  pos: number[],
  reflectingRate?: number[],
  isTransparent?: boolean,
  transparentRate?: number[]
) {
  const ans = new MeshObject(
    pos,
    reflectingRate,
    isTransparent,
    transparentRate
  );
  sphereMesh.forEach((mesh) =>
    ans.addMesh(
      mesh[0].map((a) => a * radius),
      mesh[1].map((a) => a * radius),
      mesh[2].map((a) => a * radius)
    )
  );
  return ans;
}
