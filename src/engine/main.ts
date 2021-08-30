import P5 from 'p5';
import { Camera } from './Camera';
import { LightObject } from './LightObject';
import { Mesh } from './Mesh';
import { MeshObject } from './MeshObject';
import { PointLight } from './PointLight';
import { scene } from '../setup';
import '../style.css';

const sketch = (p5: P5) => {
  let keyStack: number[] = [];
  const meshes: Mesh[] = [];
  const lights: PointLight[] = [];
  const lightObjects: LightObject[] = [];
  const meshObjects: MeshObject[] = [];
  const keyEvents: { key: number; event: () => void }[] = [];
  let observer: Camera = new Camera(p5);
  let map: P5.Graphics;
  scene(observer, meshObjects, lightObjects, keyEvents);

  const getKey = () => {
    if (keyStack) {
      return keyStack[keyStack.length - 1];
    }
    return undefined;
  };

  p5.setup = () => {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    map = p5.createGraphics(288, 288);
    meshes.push(...meshObjects.flatMap((val) => val.toMeshesList(p5)));
    lights.push(...lightObjects.flatMap((val) => val.getLight(p5)));
    p5.background(0);
  };

  p5.draw = () => {
    for (let keyEvent of keyEvents) {
      if (getKey() === keyEvent.key) {
        keyEvent.event();
      }
    }
    observer.update(meshes, lights, getKey);
    observer.draw();
    map.fill(0);
    map.stroke(50);
    map.strokeWeight(4);
    map.rect(0, 0, map.width, map.height);
    for (let meshObject of meshObjects) {
      meshObject.draw(map);
    }

    for (let light of lights) {
      light.draw(map);
    }
    observer.drawGraph(map);
    p5.image(map, 1024, 0);
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
