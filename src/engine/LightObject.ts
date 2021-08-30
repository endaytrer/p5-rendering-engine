import P5 from 'p5';
import { PointLight } from './PointLight';

export class LightObject {
  public intensity: number;
  public pos: number[];
  public temperature: number | undefined;
  constructor(intensity: number, pos: number[], temperature?: number) {
    this.intensity = intensity;
    this.pos = pos;
    this.temperature = temperature;
  }
  public getLight(p5: P5) {
    return new PointLight(this.intensity, p5.createVector(this.pos[0], this.pos[1], this.pos[2]));
  }
}