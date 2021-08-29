import P5 from 'p5';
import { Mesh } from './Mesh';
import { PointLight } from './PointLight';

export class Ray {
  public pos: P5.Vector;
  public dir: P5.Vector;
  static readonly maxReflectTime = 4;
  constructor(pos: P5.Vector, dir: P5.Vector) {
    this.pos = pos;
    this.dir = dir;
  }
  private static recursiveCollide(
    meshes: Mesh[],
    lightSources: PointLight[],
    startPoint: P5.Vector,
    direction: P5.Vector,
    reflectingTime: number,
    lastMesh?: Mesh
  ): number[] {
    if (reflectingTime > Ray.maxReflectTime) return [0, 0, 0];
    let minDist = Infinity;
    let renderingMesh = undefined;
    let brightness = [0, 0, 0];
    let transparentMeshes: { mesh: Mesh; distance: number }[] = [];
    for (let mesh of meshes) {
      if (mesh === lastMesh) continue;
      const intersection = intersect(
        startPoint,
        direction,
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
      if (renderingMesh.isMirror) {
        const normal = renderingMesh.getNormalVector();
        const reflected = Ray.recursiveCollide(
          meshes,
          lightSources,
          P5.Vector.add(startPoint, P5.Vector.mult(direction, minDist)),
          P5.Vector.sub(
            direction,
            P5.Vector.mult(normal, 2 * normal.dot(direction))
          ).normalize(),
          reflectingTime + 1,
          renderingMesh
        );
        brightness[0] += renderingMesh.mirroringRate[0] * reflected[0];
        brightness[1] += renderingMesh.mirroringRate[1] * reflected[1];
        brightness[2] += renderingMesh.mirroringRate[2] * reflected[2];
      }
      const rendered = Ray.render(
        renderingMesh,
        P5.Vector.add(startPoint, P5.Vector.mult(direction, minDist)),
        meshes,
        lightSources
      );
      brightness[0] += rendered[0];
      brightness[1] += rendered[1];
      brightness[2] += rendered[2];
    }
    if (transparentMeshes) {
      transparentMeshes.sort((a, b) => b.distance - a.distance);
      for (let nested of transparentMeshes) {
        const { mesh, distance } = nested;
        brightness[0] *= mesh.transparentRate[0];
        brightness[1] *= mesh.transparentRate[1];
        brightness[2] *= mesh.transparentRate[2];
        if (mesh.isMirror) {
          const normal = mesh.getNormalVector();

          const reflected = Ray.recursiveCollide(
            meshes,
            lightSources,
            P5.Vector.add(startPoint, P5.Vector.mult(direction, distance)),
            P5.Vector.sub(
              direction,
              P5.Vector.mult(normal, 2 * normal.dot(direction))
            ),
            reflectingTime + 1,
            mesh
          );
          brightness[0] += mesh.mirroringRate[0] * reflected[0];
          brightness[1] += mesh.mirroringRate[1] * reflected[1];
          brightness[2] += mesh.mirroringRate[2] * reflected[2];
        }
        const rendered = Ray.render(
          mesh,
          P5.Vector.add(startPoint, P5.Vector.mult(direction, distance)),
          meshes,
          lightSources
        );
        brightness[0] += rendered[0];
        brightness[1] += rendered[1];
        brightness[2] += rendered[2];
      }
    }
    return brightness;
  }
  collide(meshes: Mesh[], lightSources: PointLight[]) {
    return Ray.recursiveCollide(meshes, lightSources, this.pos, this.dir, 0);
  }
  static render(
    renderingMesh: Mesh,
    collidingPoint: P5.Vector,
    meshes: Mesh[],
    lightSources: PointLight[],
    backgroundLight: number[] = [0, 0, 0]
  ) {
    const brightness = backgroundLight;
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
