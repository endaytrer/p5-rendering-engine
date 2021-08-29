import P5 from 'p5';
import { Directed } from './Interfaces';

export class PointLight {
  public intensity: number;
  public pos: P5.Vector;
  public temperature: number;
  public intensityVector: number[];
  constructor(intensity: number, pos: P5.Vector, temperature = 6500) {
    this.intensity = intensity;
    this.pos = pos;
    this.temperature = temperature;
    this.intensityVector = this.getColor();
  }
  draw(p5: P5) {
    p5.noStroke();
    p5.fill(100, 100, 255);
    p5.ellipse(this.pos.x / 2, 150 - this.pos.y / 2, 8);
  }
  getColor(): number[] {
    const scaledTemp = this.temperature / 100;
    const red =
      scaledTemp <= 66
        ? this.intensity
        : 1.2929361861 *
          this.intensity *
          Math.pow(scaledTemp - 60, -0.1332047592);

    const green =
      scaledTemp <= 66
        ? 0.3900815788 * Math.log(scaledTemp) * this.intensity -
          0.6318414438 * this.intensity
        : 1.1298908609 *
          this.intensity *
          Math.pow(scaledTemp - 60, -0.0755148492);
    const blue =
      scaledTemp >= 66
        ? this.intensity
        : scaledTemp <= 19
        ? 0
        : 0.5432067891 * this.intensity * Math.log(scaledTemp - 10) -
          1.1962540891 * this.intensity;
    return [red, green, blue];
  }
  public couldLit(_point: P5.Vector) {
    return true;
  }
}
export class SpotLight extends PointLight implements Directed {
  public dir: P5.Vector;
  public maxAngle: number;
  constructor(
    intensity: number,
    pos: P5.Vector,
    dir: P5.Vector,
    maxAngle: number,
    temperature = 6500
  ) {
    super(intensity, pos, temperature);
    this.dir = dir;
    this.maxAngle = maxAngle;
  }
  override couldLit(point: P5.Vector) {
    return (
      P5.Vector.sub(point, this.pos).normalize().dot(this.dir) >
      Math.cos(this.maxAngle)
    );
  }
  override draw(p5: P5) {
    p5.noStroke();
    p5.fill(100, 255, 100);
    p5.ellipse(this.pos.x / 2, 150 - this.pos.y / 2, 8);
  }
}
