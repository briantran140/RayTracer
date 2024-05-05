//--
//Geometries
//--

//Sphere defition(s)
const sphere1 = new Sphere(new Vector3(0, 0, 0), 50);

const sphere2 = new Sphere(new Vector3(50, -50, 0), 30);

const sphere3 = new Sphere(new Vector3(-50, -50, 0), 30);
const sphere4 = new Sphere(new Vector3(-50, 50, 0), 30);
const sphere5 = new Sphere(new Vector3(50, 50, 0), 30);

//--
//Camera defition(s)
//--

const perspectiveCamera = new Camera(
  new Vector3(0, 0, 300),
  new Vector3(0, 0, -1),
  Vector3.up,
  Camera.Perspective,
  Math.PI / 8
);
//--
//Shader definition(s)
//-
const diffuseShaderWhite = new DiffuseShader({ r: 255, g: 255, b: 255 });
const diffuseShaderSharingan = new DiffuseShader({ r: 165, g: 12, b: 14 });
const diffuseShaderGreen = new DiffuseShader({ r: 0, g: 255, b: 0 });
const diffuseShaderBlue = new DiffuseShader({ r: 0, g: 0, b: 0 });
const diffuseShaderRinnegan = new DiffuseShader({ r: 85, g: 70, b: 139 });

const perfectMirrorShader = new MirrorShader();
const semiMirrorShader = new MixShader(
  diffuseShaderBlue,
  perfectMirrorShader,
  0.75
);

//--
//RayTracedObject definition(s)
//--
// middle
const rayTracedSphere1 = new RayTracedObject(sphere1, diffuseShaderSharingan);
const rayTracedSphere1_1 = new RayTracedObject(sphere1, diffuseShaderBlue);

// Rinnegan
const rayTracedSphere2 = new RayTracedObject(sphere2, perfectMirrorShader);
const rayTracedSphere2_2 = new RayTracedObject(sphere2, diffuseShaderWhite);
// Black
const rayTracedSphere3 = new RayTracedObject(sphere3, semiMirrorShader);
const rayTracedSphere3_3 = new RayTracedObject(sphere3, diffuseShaderWhite);
// 4
const rayTracedSphere4 = new RayTracedObject(sphere4, perfectMirrorShader);
const rayTracedSphere4_4 = new RayTracedObject(sphere4, diffuseShaderWhite);

// 5
const rayTracedSphere5 = new RayTracedObject(sphere5, semiMirrorShader);
const rayTracedSphere5_5 = new RayTracedObject(sphere5, diffuseShaderWhite);

//--
//Lights
//

const sunLight = new SunLight(Vector3.one, new Vector3(0, -1, 0));
const sunLight2 = new SunLight(Vector3.one, new Vector3(1, 1, 1));
const sunLight3 = new SunLight(Vector3.one, new Vector3(1, 0, 1));
const triplelights = [sunLight, sunLight2, sunLight3];
//--
//Scene definition(s)
//--
const narutoSphere = new Scene(
  [
    rayTracedSphere1,
    rayTracedSphere1_1,
    rayTracedSphere2,
    rayTracedSphere2_2,
    rayTracedSphere3,
    rayTracedSphere3_3,
    rayTracedSphere4,
    rayTracedSphere4_4,
    rayTracedSphere5,
    rayTracedSphere5_5,
  ],
  perspectiveCamera,
  triplelights
);

if (!sceneIndex) sceneIndex = 0;
const allScenes = [narutoSphere];

//--
//Final scene definition.
//This is the scene that gets rendered
//--
Scene.scene = allScenes[sceneIndex];
