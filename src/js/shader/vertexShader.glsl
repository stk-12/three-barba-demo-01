varying vec2 vUv;
uniform float uTime;
uniform float uPower;

#pragma glslify: pnoise = require(glsl-noise/periodic/3d);

void main() {
  vUv = uv;
  vec3 pos = position;

  float distortion = pnoise((normal + uTime * 5.0), vec3(20.0) * 1.5) * uPower;
  pos = vec3((pos.x + distortion), (pos.y + distortion), (pos.z + distortion));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}