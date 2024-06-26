/**
 * A triangular mesh
 */
class Mesh {
  /**
   * Factory method that takes an OBJ and creates a mesh
   * @param {String} string A string in OBJ format
   * @returns A mesh represented by the OBJ string
   */
  static fromOBJ(string) {
    //Break down the string by lines
    const lines = string.split("\n");

    //Where values will be stored
    const vs = []; //Vertex array
    const vts = []; //Texture coordinates array
    const vns = []; //Normals array
    const fs = []; //Faces array

    //Loop over all the lines
    for (let line of lines) {
      //Trim everything so whitespace doesn't break the parsel
      const trimmedLine = line.trim();

      //If the string is empty after trimming, ignore it.
      if (trimmedLine.length == 0) continue;

      //Split the line delimited by spaces
      const parts = line.trim().split(" ");

      //Look at the lineHeader, i.e., the first part of the line
      const lineHeader = parts[0].trim();

      //Handle vertices
      if (lineHeader == "v") {
        //push onto v
        const v = new Vector3(
          parseFloat(parts[1]),
          parseFloat(parts[2]),
          parseFloat(parts[3])
        );
        vs.push(v);
      }
      //Handle texture coordinates
      if (lineHeader == "vt") {
        //push onto vt
        const vt = new Vector3(parseFloat(parts[1]), parseFloat(parts[2]));
        vts.push(vt);
      }
      //Handle normals
      if (lineHeader == "vn") {
        //push onto n
        const vn = new Vector3(
          parseFloat(parts[1]),
          parseFloat(parts[2]),
          parseFloat(parts[3])
        );
        vns.push(vn);
      }
      //Handle faces
      if (lineHeader == "f") {
        //push onto f
        const face = {
          points: [],
        };
        //Loop over the parts of a face definition
        for (let i = 1; i <= 3; i++) {
          //Grab the part we are on
          const first = parts[i];

          //Split on forward slashes
          const coords = first.split("/");

          //Get the vertex index
          const vIndex = parseInt(coords[0].trim()) - 1;

          //Get the texture coordinate index
          const vtIndex = parseInt(coords[1].trim()) - 1;

          //Get the normal index
          const vnIndex = parseInt(coords[2].trim()) - 1;

          //Put the values into a vertex
          const temp = new Vertex(vs[vIndex], vts[vtIndex], vns[vnIndex]);

          //Add the vertex to the current face
          face.points.push(temp);
        }
        fs.push(face);
      }
    }

    //Generate a triangle
    const triangle = new Triangle(
      fs[0].points[0],
      fs[0].points[1],
      fs[0].points[2]
    );

    //Generate a mesh
    const mesh = new Mesh([triangle]);
    return mesh;
  }

  /**
   * Given a list of triangles, generate a new mesh object
   * @param {TriangleArray} triangles
   */
  constructor(triangles) {
    this.triangles = triangles;
  }

  /**
   * Find the intersection of the ray with this mesh.
   *
   * @param {Vector3} rayOrigin The origin of the ray
   * @param {Vector3} rayDirection The direction of the ray
   * @returns The collision point (if any)
   */
  intersect(rayOrigin, rayDirection) {
    const closest = Number.MAX_VALUE; //Store the closest collision distance
    const best = undefined; //Store the closest collision object

    //Loop over the triangles
    for (let triangle of this.triangles) {
      //Find the intersection
      const intersection = triangle.intersect(rayOrigin, rayDirection);

      //If the intersection exists...
      if (intersection) {
        //...and the intersection is closer than any we've seen before...
        if (intersection.timeToCollision < closest) {
          //Store the collision details for further comparison
          best = intersection;
          closest = intersection.timeToCollision;
        }
      }
    }
    //If we found an intersection...
    if (best) {
      //...return its collision object
      return best;
    } else {
      //...otherwise, return undefined
      return;
    }
  }
}
