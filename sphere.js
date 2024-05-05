/**
 * A class that explains a sphere parametrically
 */
class Sphere {
  /**
   * Create a sphere with the given center coordinate
   * and radius.
   * @param {Vector3} center The center of the sphere
   * @param {Number} radius - The radius of the sphere.
   * */
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
  }
  /**
   * Calculates the intersection point between a ray and
   * this sphere.
   * @param {Vector3} o - The origin of the ray
   * @param {Vector3} d - The direction of the ray
   * @returns undefined if there are no real roots or both roots are
   * behind the ray origin, the coordinate of the closest collision point otherwise
   * */
  intersect(o, d) {
    let r = this.radius;
    let oMinusC = o.minus(this.center);

    /**
     * If we solve for the quadratic formula, we have
     * A = d\cdot d
     * B = 2\cdot D(O-C)
     * C = (O-C)^2-r^2
     *
     * Since d is normalized, d\cdot d = 1
     * Note that (O-C)^2 means the dot product of (O-C) with itself.
     * Saving (O-C) as a oMinusC, we have the following:
     */
    const A = 1;
    const B = 2 * d.dot(oMinusC);
    const C = oMinusC.dot(oMinusC) - this.radius ** 2;

    const discriminant = B ** 2 - 4 * A * C;

    if (discriminant <= 0) {
      return undefined;
    }

    /**
     * This root is not the same as the discriminant.
     * The reason is that I have simplified the equation
     * Notably, since D\cdot D is 1, there is no need for A
     * in the discriminant. Also, you can factor 2 out of the equation,
     * which removes the denominator and the 2 in front of -oMinusC
     * toRoot should be discriminant/4.
     */
    const toRoot = d.dot(oMinusC) ** 2 - (oMinusC.dot(oMinusC) - r ** 2);
    const sqrt = Math.sqrt(toRoot);
    const t1 = -d.dot(oMinusC) - sqrt;
    const t2 = -d.dot(oMinusC) + sqrt;

    let timeToCollision;

    //If both collision points are positive, choose the closest one
    if (t1 > 0 && t2 > 0) {
      timeToCollision = Math.min(t1, t2);
    }
    //Both collision points were not infront of the ray.
    else {
      //Check if t1 is positive
      if (t1 > 0) timeToCollision = t1;
      //Check if t2 is positive
      else if (t2 > 0) timeToCollision = t2;
      //They are both behind the ray origin
      else return undefined; //The only collision points were behind the origin of the ray
    }

    const collisionLocation = o.add(d.scale(timeToCollision));
    return new Collision(
      timeToCollision,
      collisionLocation,
      collisionLocation.minus(this.center).normalize()
    );
  }
}
