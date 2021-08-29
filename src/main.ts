import P5 from 'p5';
import { Camera } from './Camera';
import { Mesh } from './Mesh';
import { Cube, Sphere } from './MeshObject';
import { PointLight, SpotLight } from './PointLight';
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
    Cube(16, [50, 50, 20], [0.5, 0.5, 0.5], true, [0.5, 0.5, 0.5]),
    Sphere(11, [70, 30, 10]),
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
    const theta = (Math.PI * 7) / 6;
    const phi = (Math.PI * 3) / 4;
    lights.push(
      new SpotLight(
        8000000,
        p5.createVector(120, 60, 120),
        p5.createVector(
          Math.cos(theta) * Math.sin(phi),
          Math.sin(theta) * Math.sin(phi),
          Math.cos(phi)
        ),
        0.4,
        3000
      )
    );
    lights.push(new PointLight(1200000, p5.createVector(100, 150, 90), 12000));
    observer = new Camera(p5, p5.createVector(75, 120, 50), 4.5, 2, true, 0.5);
    p5.background(0);
  };

  p5.draw = () => {
    observer.update(meshes, lights, getKey);
    observer.draw();
    p5.fill(0);
    p5.stroke(50);
    p5.strokeWeight(4);
    p5.rect(0, 0, 150, 150);
    for (let light of lights) {
      light.draw(p5);
    }
    for (let meshObject of meshObjects) {
      meshObject.draw(p5);
    }
    observer.drawGraph();
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
