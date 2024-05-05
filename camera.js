class Camera {
  static Orthographic = 0;
  static Perspective = 1;

  constructor(origin, direction, up, type, angle = Math.PI / 4) {
    this.origin = origin;
    this.direction = direction.normalize();
    this.up = up.normalize();
    this.type = type;
    this.angle = angle;
  }

  getOrigin(x, y) {
    if (this.type == Camera.Orthographic) {
      return new Vector3(x, y, this.origin.z);
    } else {
      //Assume it's perspective
      return this.origin;
    }
  }
  getDirection(x, y) {
    if (this.type == Camera.Orthographic) {
      return this.direction;
    } else {
      //Take a cross product to determine the right direction
      const right = this.direction.cross(this.up).normalize();

      //Recalculate the up direction for our sanity
      const up = right.cross(this.direction).normalize();

      const cos = Math.cos(this.angle);
      const sin = Math.sin(this.angle);

      const xOffset = right.scale(x).scale(sin);
      const yOffset = up.scale(y).scale(sin);

      const newDirection = this.direction
        .scale(cos)
        .add(xOffset)
        .add(yOffset)
        .normalize();

      return newDirection;
    }
  }
}
