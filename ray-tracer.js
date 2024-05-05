"use strict";

/** Get a random number in [-1,1] scaled by amount */
function evenRand(amount) {
  return (Math.random() * 2 - 1) * amount;
}

/**
 * The main ray tracing routine
 */
async function main() {
  const canvas = document.querySelector("canvas");
  canvas.width = width * 2;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const image = Array.from(Array(width), () => new Array(height));
  const noise = Array.from(Array(width), () => new Array(height));
  const maxIteration = 0;
  const minCount = 5;
  const stop = samples;
  const noiseMax = 50;

  //Ray Tracer starts
  //Loop over all the pixels
  for (let i = 0; i < stop; i++) {
    for (let y = 0; y < height; y++) {
      setTimeout(() => {
        for (let x = 0; x < width; x++) {
          if (!image[x][y]) image[x][y] = [];
          if (!noise[x][y]) noise[x][y] = 0;
          const entry = image[x][y];
          let count = entry.length;
          //Drop out if our color is consistent enough
          if (count > minCount) {
            if (noise[x][y] < noiseMax) continue;
          }

          const color = render(x, y, jitterAmount);
          count++;
          entry.push(color);

          const r = entry.map((p) => p.r).reduce((a, b) => a + b, 0) / count;
          const g = entry.map((p) => p.g).reduce((a, b) => a + b, 0) / count;
          const b = entry.map((p) => p.b).reduce((a, b) => a + b, 0) / count;

          const rstd =
            entry.map((p) => Math.abs(p.r - r)).reduce((a, b) => a + b, 0) /
            count;
          const gstd =
            entry.map((p) => Math.abs(p.r - r)).reduce((a, b) => a + b, 0) /
            count;
          const bstd =
            entry.map((p) => Math.abs(p.r - r)).reduce((a, b) => a + b, 0) /
            count;

          const sumNoise = rstd + gstd + bstd;
          noise[x][y] = sumNoise;

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x, y, 1, 1);
          if (sumNoise > noiseMax) {
            ctx.fillStyle = `rgb(${sumNoise}, ${sumNoise}, ${sumNoise})`;
            ctx.fillRect(x + width, y, 1, 1);
          }
        }
        if (i > maxIteration) {
          maxIteration = i;
          console.log(maxIteration / stop);
        }
      });
    }
  }

  ctx.fillStyle = "red";
  ctx.fillRect(width / 2, height / 2, 1, 1);
}

/**
 * Run our ray tracer
 */
function render(x, y, jitterAmount) {
  //Grab the background color from the scene object (if it is defined)
  const backgroundColor = Scene.scene?.options?.backgroundColor
    ? Scene.scene.options.backgroundColor
    : new Vector3(100, 100, 139);

  //The color of the closest collision for this pixel
  let rayTracedPixel = backgroundColor;

  //Determine the origin and direction of the ray
  const startX = x - width / 2;
  const startY = y - height / 2;
  let origin = Scene.scene.camera.getOrigin(startX, startY);
  let direction = Scene.scene.camera.getDirection(
    startX / (width / 2),
    startY / (height / 2)
  );

  const jittered = direction
    .add(
      new Vector3(
        evenRand(jitterAmount),
        evenRand(jitterAmount),
        evenRand(jitterAmount)
      )
    )
    .normalize();

  direction = jittered;

  const result = closestCollision(origin, direction, null, 1);
  if (!result) return rayTracedPixel;
  rayTracedPixel = result.rayTracedObject.shader.illuminateObject(
    origin,
    result.collisionLocation,
    result.normalAtCollision,
    result.rayTracedObject,
    10
  );

  return rayTracedPixel;
}

function closestCollision(origin, direction, ignored = null, remaining = 1) {
  if (remaining <= 0) return;
  let closestPositiveT = Number.MAX_VALUE;
  let closestCollision;

  //The color of the closest collision for this pixel
  for (let rayTracedObject of Scene.scene.rayTracedObjects) {
    if (rayTracedObject == ignored) continue;
    //Get the geometry of the current object
    const geometry = rayTracedObject.geometry;

    //Find the intersection with this object
    let collision = geometry.intersect(origin, direction);

    //Check to see if the collision exists...
    //...and if it is closer than any other collision we've seen
    if (collision && collision.timeToCollision < closestPositiveT) {
      //Get the distance to collision
      closestPositiveT = collision.timeToCollision;
      collision.rayTracedObject = rayTracedObject;

      closestCollision = collision;
    }
  }
  return closestCollision;
}

//Run the main ray tracer
main();
