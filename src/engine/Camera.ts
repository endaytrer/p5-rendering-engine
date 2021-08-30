import P5 from 'p5';
import { Mesh } from './Mesh';
import { PointLight } from './PointLight';
import { Ray } from './Ray';
export class Camera {
  public renderOver = false;
  private rayInterval;
  readonly lineWidth = 4;
  readonly rayRangeTheta = Math.PI * 0.4;
  private resolution = [16, 9];
  readonly initialResolution = [16, 9];
  private pixelSize = 64;
  readonly initialPixelSize = 64;
  public pointPhi: number;
  public renderingI = 0;
  private p5: P5;
  public pos: P5.Vector;
  public pointTheta: number;
  public angularVelocity = 0.05;
  public pointVelocity = 1;
  public rays: Ray[][];
  public view: (number[] | null)[][] = [];
  detailRendering() {
    this.renderingI = 0;
    this.resolution[0] *= 2;
    this.resolution[1] *= 2;
    this.rayInterval = this.rayRangeTheta / this.resolution[0];
    this.pixelSize /= 2;
    for (let i = 0; i < this.resolution[0]; i++) {
      const theta =
        this.rayRangeTheta / 2 - (i / this.resolution[0]) * this.rayRangeTheta;
      if (i % 2) {
        const temp: Ray[] = [];
        const viewTemp: (number[] | null)[] = [];
        for (let j = 0; j < this.resolution[1]; j++) {
          const phi =
            -(this.resolution[1] * this.rayInterval) / 2 + j * this.rayInterval;
          const dir = [
            Math.cos(phi) * Math.cos(theta),
            Math.sin(theta),
            -Math.sin(phi) * Math.cos(theta),
          ];
          const a = this.pointTheta;
          const b = this.pointPhi - Math.PI / 2;
          const rayDir = [
            dir[0] * (Math.cos(a) * Math.cos(b)) +
              dir[1] * -Math.sin(a) +
              dir[2] * (Math.cos(a) * Math.sin(b)),
            dir[0] * (Math.sin(a) * Math.cos(b)) +
              dir[1] * Math.cos(a) +
              dir[2] * (Math.sin(a) * Math.sin(b)),
            dir[0] * -Math.sin(b) + dir[2] * Math.cos(b),
          ];
          const pointVector = this.p5.createVector(
            rayDir[0],
            rayDir[1],
            rayDir[2]
          );
          temp.push(new Ray(this.pos, pointVector));
          viewTemp.push(null);
        }
        this.rays.splice(i, 0, temp);
        this.view.splice(i, 0, viewTemp);
      } else {
        for (let j = 0; j < this.resolution[1]; j++) {
          if (j % 2 === 0) continue;
          const phi =
            -(this.resolution[1] * this.rayInterval) / 2 + j * this.rayInterval;
          const dir = [
            Math.cos(phi) * Math.cos(theta),
            Math.sin(theta),
            -Math.sin(phi) * Math.cos(theta),
          ];
          const a = this.pointTheta;
          const b = this.pointPhi - Math.PI / 2;
          const rayDir = [
            dir[0] * (Math.cos(a) * Math.cos(b)) +
              dir[1] * -Math.sin(a) +
              dir[2] * (Math.cos(a) * Math.sin(b)),
            dir[0] * (Math.sin(a) * Math.cos(b)) +
              dir[1] * Math.cos(a) +
              dir[2] * (Math.sin(a) * Math.sin(b)),
            dir[0] * -Math.sin(b) + dir[2] * Math.cos(b),
          ];
          const pointVector = this.p5.createVector(
            rayDir[0],
            rayDir[1],
            rayDir[2]
          );
          this.rays[i].splice(j, 0, new Ray(this.pos, pointVector));
          this.view[i].splice(j, 0, null);
        }
      }
    }
  }
  resetRays() {
    this.renderOver = false;
    this.renderingI = 0;
    this.rayInterval = this.rayRangeTheta / this.resolution[0];
    this.rays = [];
    this.view = [];
    for (let i = 0; i < this.resolution[0]; i++) {
      const theta =
        this.rayRangeTheta / 2 - (i / this.resolution[0]) * this.rayRangeTheta;
      const temp = [];
      const viewTemp: (number[] | null)[] = [];
      for (let j = 0; j < this.resolution[1]; j++) {
        const phi =
          -(this.resolution[1] * this.rayInterval) / 2 + j * this.rayInterval;
        const dir = [
          Math.cos(phi) * Math.cos(theta),
          Math.sin(theta),
          -Math.sin(phi) * Math.cos(theta),
        ];
        const a = this.pointTheta;
        const b = this.pointPhi - Math.PI / 2;
        const rayDir = [
          dir[0] * (Math.cos(a) * Math.cos(b)) +
            dir[1] * -Math.sin(a) +
            dir[2] * (Math.cos(a) * Math.sin(b)),
          dir[0] * (Math.sin(a) * Math.cos(b)) +
            dir[1] * Math.cos(a) +
            dir[2] * (Math.sin(a) * Math.sin(b)),
          dir[0] * -Math.sin(b) + dir[2] * Math.cos(b),
        ];
        const pointVector = this.p5.createVector(
          rayDir[0],
          rayDir[1],
          rayDir[2]
        );
        temp.push(new Ray(this.pos, pointVector));
        viewTemp.push(null);
      }
      this.rays.push(temp);
      this.view.push(viewTemp);
    }
  }
  constructor(p5: P5) {
    this.p5 = p5;
    this.pos = p5.createVector(0, 0, 0);
    this.pointTheta = 0;
    this.pointPhi = 0;
    this.rayInterval = this.rayRangeTheta / this.resolution[0];
    this.rays = [];
  }
  setInitialAttributes(
    x: number,
    y: number,
    z: number,
    theta: number,
    phi: number
  ) {
    this.pos = this.p5.createVector(x, y, z);
    this.pointTheta = theta;
    this.pointPhi = phi;
    this.resetRays();
  }
  update(
    walls: Mesh[],
    lights: PointLight[],
    getKey: () => number | undefined
  ): void {
    this.dealMoveRotate(getKey);
    this.calculateCollide(walls, lights);
  }
  dealMoveRotate(getKey: () => number | undefined) {
    const key = getKey();
    if (key) {
      let flag = false;
      if (key === this.p5.LEFT_ARROW) {
        this.pointTheta += this.angularVelocity;
        flag = true;
      }
      if (key === this.p5.RIGHT_ARROW) {
        this.pointTheta -= this.angularVelocity;
        flag = true;
      }
      if (key === this.p5.UP_ARROW) {
        this.pointPhi -= this.angularVelocity;
        flag = true;
      }
      if (key === this.p5.DOWN_ARROW) {
        this.pointPhi += this.angularVelocity;
        flag = true;
      }
      if (this.pointPhi < 0) {
        this.pointPhi += 2 * Math.PI;
      }
      if (this.pointPhi > 2 * Math.PI) {
        this.pointPhi -= 2 * Math.PI;
      }
      if (this.pointTheta < 0) {
        this.pointTheta += 2 * Math.PI;
      }
      if (this.pointTheta > 2 * Math.PI) {
        this.pointTheta -= 2 * Math.PI;
      }
      if (key === this.p5.SHIFT) {
        this.pos.add(0, 0, this.pointVelocity);
        flag = true;
      }
      if (key === this.p5.CONTROL) {
        this.pos.add(0, 0, -this.pointVelocity);
        flag = true;
      }
      if (key === 87) {
        // 'w'
        this.pos.add(
          this.pointVelocity * Math.cos(this.pointTheta),
          this.pointVelocity * Math.sin(this.pointTheta),
          0
        );
        flag = true;
      }
      if (key === 83) {
        // 's'
        this.pos.add(
          -this.pointVelocity * Math.cos(this.pointTheta),
          -this.pointVelocity * Math.sin(this.pointTheta),
          0
        );
        flag = true;
      }
      if (key === 65) {
        // 'a'
        this.pos.add(
          -this.pointVelocity * Math.sin(this.pointTheta),
          this.pointVelocity * Math.cos(this.pointTheta),
          0
        );
        flag = true;
      }
      if (key === 68) {
        // 'd'
        this.pos.add(
          this.pointVelocity * Math.sin(this.pointTheta),
          -this.pointVelocity * Math.cos(this.pointTheta),
          0
        );
        flag = true;
      }
      if (flag) {
        this.pixelSize = this.initialPixelSize;
        this.resolution = this.initialResolution.slice();
        this.resetRays();
      }
    }
  }
  calculateCollide(meshes: Mesh[], lights: PointLight[]) {
    if (this.renderOver) return;
    if (this.pixelSize === this.initialPixelSize) {
      for (let i = 0; i < this.rays.length; i++) {
        for (let j = 0; j < this.rays[i].length; j++) {
          if (this.view[i][j] === null) {
            this.view[i][j] = this.rays[i][j].collide(meshes, lights);
          }
        }
      }
    } else {
      const i = this.renderingI;
      for (let j = 0; j < this.rays[i].length; j++) {
        if (this.view[i][j] === null) {
          this.view[i][j] = this.rays[i][j].collide(meshes, lights);
        }
      }
    }
  }
  draw() {
    if (this.renderOver) return;
    this.p5.noStroke();
    if (this.pixelSize == this.initialPixelSize) {
      for (let i = 0; i < this.view.length; i++) {
        for (let j = 0; j < this.view[i].length; j++) {
          const ray = this.view[i][j] as number[];
          this.p5.fill(ray[0], ray[1], ray[2]);
          this.p5.rect(
            i * this.pixelSize,
            j * this.pixelSize,
            this.pixelSize,
            this.pixelSize
          );
        }
      }
      this.renderingI = Infinity;
    } else {
      for (let j = 0; j < this.view[this.renderingI].length; j++) {
        const ray = this.view[this.renderingI][j] as number[];
        this.p5.fill(ray[0], ray[1], ray[2]);
        this.p5.rect(
          this.renderingI * this.pixelSize,
          j * this.pixelSize,
          this.pixelSize,
          this.pixelSize
        );
      }
      this.renderingI++;
    }
    this.p5.strokeWeight(2 * this.lineWidth);
    this.p5.stroke(
      (255 * (Math.log2(this.initialPixelSize) - Math.log2(this.pixelSize))) /
        Math.log2(this.initialPixelSize)
    );
    this.p5.strokeCap('butt');
    this.p5.beginShape();
    this.p5.vertex(
      0,
      this.initialPixelSize * this.initialResolution[1] + this.lineWidth
    );
    this.p5.vertex(
      this.renderingI * this.pixelSize,
      this.initialPixelSize * this.initialResolution[1] + this.lineWidth
    );
    this.p5.endShape();
    if (this.renderingI >= this.rays.length) {
      if (this.pixelSize === 1) {
        this.renderOver = true;
        return;
      }
      this.detailRendering();
      this.p5.stroke(0);
      this.p5.beginShape();
      this.p5.vertex(
        0,
        this.initialPixelSize * this.initialResolution[1] + this.lineWidth
      );
      this.p5.vertex(
        this.initialPixelSize * this.initialResolution[0],
        this.initialPixelSize * this.initialResolution[1] + this.lineWidth
      );
      this.p5.endShape();
    }
  }
  drawGraph(map: P5) {
    map.fill(255);
    map.ellipse(this.pos.x / 2, map.height - this.pos.y / 2, 8);
    map.stroke(255);
    map.strokeWeight(3);
    map.beginShape();
    map.vertex(this.pos.x / 2, map.height - this.pos.y / 2);
    map.vertex(
      this.pos.x / 2 + 10 * Math.cos(this.pointTheta),
      map.height - this.pos.y / 2 - 10 * Math.sin(this.pointTheta)
    );
    map.endShape();
    map.noStroke();
    map.fill(255, 100);
    map.text(
      'x: ' +
        this.pos.x.toFixed(1) +
        '\ny: ' +
        this.pos.y.toFixed(1) +
        '\nz: ' +
        this.pos.z.toFixed(1) +
        '\ntheta: ' +
        this.pointTheta.toFixed(2) +
        '\nphi :' +
        this.pointPhi.toFixed(2),
      10,
      18
    );
  }
}
