import P5 from 'p5';
import { Camera } from './Camera';
import { Mesh } from './Mesh';
import { Cube, Sphere } from './MeshObject';
import { PointLight } from './PointLight';
import './style.css';
const extraMeshes: number[][][] = [
  [
    [0, 0, 0],
    [300, 0, 0],
    [0, 300, 0],
  ],
  [
    [300, 300, 0],
    [-300, 0, 0],
    [0, -300, 0],
  ],
];
const sketch = (p5: P5) => {
  let keyStack: number[] = [];
  const meshes: Mesh[] = [];
  const lights: PointLight[] = [];
  const meshObjects = [
    Cube(
      40,
      [50, 165, 0],
      [0.1, 0.1, 0.1],
      false,
      [0, 0, 0],
      true,
      [0.9, 0.9, 0.9]
    ),
    Cube(
      40,
      [50, 95, 0],
      [0.1, 0.1, 0.1],
      false,
      [0, 0, 0],
      true,
      [0.9, 0.9, 0.9]
    ),
    Cube(
      15,
      [100, 161, 0],
      [0.7, 0.2, 0.1],
      false,
      [0, 0, 0],
      true,
      [0.9, 0.8, 0.3]
    ),
    Cube(
      15,
      [100, 124, 0],
      [0.1, 0.2, 0.7],
      false,
      [0, 0, 0],
      true,
      [0.3, 0.8, 0.9]
    ),
    Sphere(
      11,
      [70, 150, 20],
      [0.2, 0.1, 0.1],
      true,
      [0.6, 0.9, 0.7],
      false,
      [0.2, 0.2, 0.2]
    ),
  ];
  let observer: Camera;

  const getKey = () => {
    if (keyStack) {
      return keyStack[keyStack.length - 1];
    }
    return undefined;
  };

  p5.setup = () => {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    p5.beginShape();
    for (let wall of extraMeshes) {
      meshes.push(
        new Mesh(
          p5.createVector(wall[0][0], wall[0][1], wall[0][2]),
          p5.createVector(wall[1][0], wall[1][1], wall[1][2]),
          p5.createVector(wall[2][0], wall[2][1], wall[2][2])
        )
      );
    }
    meshes.push(...meshObjects.flatMap((val) => val.toMeshesList(p5)));
    lights.push(new PointLight(5000000, p5.createVector(-80, 150, 180), 4000));
    lights.push(new PointLight(5000000, p5.createVector(90, 150, 250), 4000));
    // lights.push(new PointLight(300000, p5.createVector(70, 160, 50), 12000));
    lights.push(new PointLight(120000, p5.createVector(70, 150, 17), 6600));
    observer = new Camera(p5, p5.createVector(130, 150, 1), Math.PI, 1.32);
    p5.background(0);
  };

  p5.draw = () => {
    observer.update(meshes, lights, getKey);
    observer.draw();
    // p5.fill(0);
    // p5.stroke(50);
    // p5.strokeWeight(4);
    // p5.rect(0, 0, 150, 150);
    // for (let light of lights) {
    // light.draw(p5);
    // }
    // for (let meshObject of meshObjects) {
    //   meshObject.draw(p5);
    // }
    // observer.drawGraph();
  };
  p5.keyPressed = () => {
    if (!keyStack.find((value) => value === p5.keyCode)) {
      keyStack.push(p5.keyCode);
    }
  };
  p5.keyReleased = () => {
    keyStack = keyStack.filter((value) => value !== p5.keyCode);
  };
};

new P5(sketch);
