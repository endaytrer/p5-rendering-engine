import P5 from 'p5';
import { Mesh } from './Mesh';
import { PointLight } from './PointLight';

export class Camera {
  public renderOver = false;
  private rayInterval = Math.PI / 100;
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
  public brightness: number;
  public isPlayer: boolean;
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
  constructor(
    p5: P5,
    pos: P5.Vector,
    pointAngle: number,
    pointPhi = Math.PI / 2,
    player = false,
    brightness = 1
  ) {
    this.p5 = p5;
    this.pos = pos;
    this.pointTheta = pointAngle;
    this.pointPhi = pointPhi;
    this.brightness = brightness;
    this.isPlayer = player;
    this.rayInterval = this.rayRangeTheta / this.resolution[0];
    this.rays = [];
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
  drawGraph() {
    this.p5.fill(255);
    this.p5.ellipse(this.pos.x / 2, 150 - this.pos.y / 2, 8);
    this.p5.stroke(255);
    this.p5.strokeWeight(3);
    this.p5.beginShape();
    this.p5.vertex(this.pos.x / 2, 150 - this.pos.y / 2);
    this.p5.vertex(
      this.pos.x / 2 + 10 * Math.cos(this.pointTheta),
      150 - this.pos.y / 2 - 10 * Math.sin(this.pointTheta)
    );
    this.p5.endShape();
  }
}

export class Ray {
  public pos: P5.Vector;
  public dir: P5.Vector;
  constructor(pos: P5.Vector, dir: P5.Vector) {
    this.pos = pos;
    this.dir = dir;
  }
  update(deltaAngle: number) {
    this.dir.set(
      this.dir.x * Math.cos(deltaAngle) - this.dir.y * Math.sin(deltaAngle),
      this.dir.x * Math.sin(deltaAngle) + this.dir.y * Math.cos(deltaAngle),
      this.dir.z
    );
  }
  collide(meshes: Mesh[], lightSources: PointLight[]) {
    let minDist = Infinity;
    let renderingMesh = undefined;
    let brightness = [0, 0, 0];
    let transparentMeshes: { mesh: Mesh; distance: number }[] = [];
    for (let mesh of meshes) {
      const intersection = intersect(
        this.pos,
        this.dir,
        mesh.pos,
        mesh.tan1,
        mesh.tan2
      );
      if (intersection && intersection < minDist) {
        if (mesh.isTransparent) {
          transparentMeshes.push({ mesh, distance: intersection });
        } else {
          transparentMeshes = transparentMeshes.filter(
            (value) => value.distance < intersection
          );
          minDist = intersection;
          renderingMesh = mesh;
        }
      }
    }
    if (renderingMesh) {
      const addition = this.render(
        renderingMesh,
        minDist,
        meshes,
        lightSources
      );
      brightness[0] += addition[0];
      brightness[1] += addition[1];
      brightness[2] += addition[2];
    }
    if (transparentMeshes) {
      transparentMeshes.sort((a, b) => b.distance - a.distance);
      for (let nested of transparentMeshes) {
        const { mesh, distance } = nested;
        brightness[0] *= mesh.transparentRate[0];
        brightness[1] *= mesh.transparentRate[1];
        brightness[2] *= mesh.transparentRate[2];
        const addition = this.render(mesh, distance, meshes, lightSources);
        brightness[0] += addition[0];
        brightness[1] += addition[1];
        brightness[2] += addition[2];
      }
    }
    return brightness;
  }
  render(
    renderingMesh: Mesh,
    distance: number,
    meshes: Mesh[],
    lightSources: PointLight[],
    backgroundLight: number[] = [0, 0, 0]
  ) {
    const brightness = backgroundLight;
    const collidingPoint = P5.Vector.add(
      this.pos,
      P5.Vector.mult(this.dir, distance)
    );
    for (let pointLight of lightSources) {
      if (!pointLight.couldLit(collidingPoint)) continue;
      const p1 = pointLight.pos;
      const s1 = P5.Vector.sub(collidingPoint, p1);
      const intensity = pointLight.intensityVector.slice();
      let flag = false;
      for (let mesh of meshes) {
        if (mesh === renderingMesh) continue;
        if (intersect(p1, s1, mesh.pos, mesh.tan1, mesh.tan2, true)) {
          if (!mesh.isTransparent) {
            flag = true;
            break;
          }
          intensity[0] *= mesh.transparentRate[0];
          intensity[1] *= mesh.transparentRate[1];
          intensity[2] *= mesh.transparentRate[2];
        }
      }
      if (flag) continue;
      const dist = s1.mag();
      const normal = Math.abs(
        renderingMesh.getNormalVector().dot(s1.normalize())
      );
      brightness[0] +=
        (renderingMesh.reflectingRate[0] * intensity[0] * normal) / dist / dist;
      brightness[1] +=
        (renderingMesh.reflectingRate[1] * intensity[1] * normal) / dist / dist;
      brightness[2] +=
        (renderingMesh.reflectingRate[2] * intensity[2] * normal) / dist / dist;
    }
    return brightness;
  }
}

function determinant(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
  g: number,
  h: number,
  i: number
) {
  return a * e * i - a * f * h + b * f * g - b * d * i + c * d * h - c * e * g;
}
function intersect(
  p1: P5.Vector,
  s1: P5.Vector,
  p2: P5.Vector,
  s2: P5.Vector,
  s3: P5.Vector,
  s1Limited = false
): undefined | number {
  const det = determinant(s1.x, s2.x, s3.x, s1.y, s2.y, s3.y, s1.z, s2.z, s3.z);
  if (det === 0) return;
  const det1 = determinant(
    p2.x - p1.x,
    s2.x,
    s3.x,
    p2.y - p1.y,
    s2.y,
    s3.y,
    p2.z - p1.z,
    s2.z,
    s3.z
  );
  const det2 = determinant(
    s1.x,
    p2.x - p1.x,
    s3.x,
    s1.y,
    p2.y - p1.y,
    s3.y,
    s1.z,
    p2.z - p1.z,
    s3.z
  );
  const det3 = determinant(
    s1.x,
    s2.x,
    p2.x - p1.x,
    s1.y,
    s2.y,
    p2.y - p1.y,
    s1.z,
    s2.z,
    p2.z - p1.z
  );
  const t = det1 / det;
  const u1 = -det2 / det;
  const u2 = -det3 / det;
  if (t < 0 || u1 + u2 > 1 || u1 < 0 || u2 < 0 || (s1Limited && t >= 1)) return;
  return t;
}
