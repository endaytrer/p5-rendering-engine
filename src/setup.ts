import { Camera } from './engine/Camera';
import { LightObject } from './engine/LightObject';
import { Cube, Ground, MeshObject, Sphere } from './engine/MeshObject';

export function scene(
  camera: Camera,
  objects: MeshObject[],
  lights: LightObject[],
  _keyEvents: { key: number; event: () => void }[]
) {
  camera.setInitialAttributes(115.5, 177.8, 1, 5.54, 1.36);
  objects.push(
    new Ground(
      300,
      300,
      [150, 150, 0.1],
      [0.2, 0.2, 0.2],
      false,
      undefined
      // true,
      // [0.8, 0.8, 0.8]
    )
  );

  objects.push(
    new Cube(
      10,
      [130, 150, 5],
      [0.6, 0.6, 0.9],
      true,
      [0.2, 0.3, 0.6],
      // true,
      // [0.17, 0.25, 0.4]
    ).rotateZ(0.2)
  );
  objects.push(
    new Sphere(
      5,
      [130, 170, 5],
      [0.8, 0.8, 0.1],
      false,
      undefined,
      // true,
      // [0.4, 0.4, 0.1]
    )
  );

  lights.push(new LightObject(3000000, [150, 150, 180], 4000));
  lights.push(new LightObject(5000000, [110, 250, 130], 4000));
  lights.push(new LightObject(120000, [70, 180, 17], 6600));
}
