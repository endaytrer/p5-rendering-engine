const vD = 30;
const hD = 2 * vD;
let res = [];
let queue = [[0, 0, 1]];
let bias = 0;
for (let i = 1; i < vD; i++) {
  const phi = (i / vD) * Math.PI;
  if (queue.length === 1) {
    p3 = queue.shift();
    for (let j = 0; j < hD; j++) {
      const theta = (j / hD) * 2 * Math.PI;
      res.push([
        toRect(theta, phi),
        diff(toRect(((j + 1) / hD) * 2 * Math.PI, phi), toRect(theta, phi)),
        diff(p3, toRect(theta, phi)),
      ]);
      queue.push(toRect(theta, phi));
      queue.push(toRect(((j + 1) / hD) * 2 * Math.PI, phi));
    }
  } else {
    for (let j = 0; j < hD; j++) {
      const theta = bias + (j / hD) * 2 * Math.PI;
      const p3 = queue.shift();
      const p4 = queue.shift();
      res.push([
        toRect(theta, phi),
        diff(
          toRect(bias + ((j + 1) / hD) * 2 * Math.PI, phi),
          toRect(theta, phi)
        ),
        diff(p3, toRect(theta, phi)),
      ]);
      res.push([
        p3,
        diff(p4, p3),
        diff(toRect(bias + ((j + 1) / hD) * 2 * Math.PI, phi), p3),
      ]);
      queue.push(toRect(theta, phi));
      queue.push(toRect(bias + ((j + 1) / hD) * 2 * Math.PI, phi));
    }
  }
  bias -= Math.PI / hD;
}
const phi = ((vD - 1) / vD) * Math.PI;
for (let j = 0; j < hD; j++) {
  const theta = (j / hD) * 2 * Math.PI;
  res.push([
    toRect(theta, phi),
    diff(toRect(bias + ((j + 1) / hD) * 2 * Math.PI, phi), toRect(theta, phi)),
    diff([0, 0, -1], toRect(theta, phi)),
  ]);
}
console.log('export default ' + JSON.stringify(res));

function toRect(theta, phi) {
  return [
    Math.cos(theta) * Math.sin(phi),
    Math.sin(theta) * Math.sin(phi),
    Math.cos(phi),
  ];
}
function diff(p1, p2) {
  return [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]];
}
