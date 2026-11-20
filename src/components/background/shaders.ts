export const fragmentVertexShader = /* glsl */ `
  attribute float aPhase;

  uniform vec3 uPointer;
  uniform float uPointerRadius;
  uniform float uPointerStrength;
  uniform float uTime;

  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying float vGlow;
  varying float vPhase;
  varying float vDepth;

  void main() {
    vec4 worldPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
    mat3 worldNormalMatrix = mat3(modelMatrix) * mat3(instanceMatrix);

    vWorldNormal = normalize(worldNormalMatrix * normal);
    vViewDirection = normalize(cameraPosition - worldPosition.xyz);
    vGlow = (1.0 - smoothstep(0.0, uPointerRadius, distance(worldPosition.xy, uPointer.xy))) * uPointerStrength;
    vPhase = aPhase;
    vDepth = -(viewMatrix * worldPosition).z;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const fragmentFragmentShader = /* glsl */ `
  uniform vec3 uColorCool;
  uniform vec3 uColorWarm;
  uniform float uOpacity;
  uniform float uTime;

  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying float vGlow;
  varying float vPhase;
  varying float vDepth;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDirection = normalize(vViewDirection);
    float facing = clamp(dot(normal, viewDirection), 0.0, 1.0);
    float fresnel = pow(1.0 - facing, 2.35);
    float rim = smoothstep(0.04, 1.0, fresnel);
    float shimmer = 0.82 + 0.18 * sin(uTime * 0.55 + vPhase * 6.2831853);
    float depthFade = 1.0 - smoothstep(8.0, 20.0, vDepth);

    vec3 color = mix(uColorCool, uColorWarm, rim);
    color = mix(color, vec3(0.86, 0.96, 1.0), vGlow * 0.55);

    float alpha = (0.045 + rim * 0.42 + vGlow * 0.5) * uOpacity * shimmer * depthFade;
    gl_FragColor = vec4(color, min(alpha, 1.0));

    #include <colorspace_fragment>
  }
`;

export const ringVertexShader = /* glsl */ `
  uniform vec3 uPointer;
  uniform float uPointerRadius;
  uniform float uPointerStrength;

  varying vec2 vRingUv;
  varying float vGlow;
  varying float vDepth;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

    vRingUv = uv;
    vGlow = (1.0 - smoothstep(0.0, uPointerRadius, distance(worldPosition.xy, uPointer.xy))) * uPointerStrength;
    vDepth = -(viewMatrix * worldPosition).z;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const ringFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHighlight;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uPhase;

  varying vec2 vRingUv;
  varying float vGlow;
  varying float vDepth;

  void main() {
    float angle = vRingUv.x * 6.2831853;
    float sheen = pow(0.5 + 0.5 * sin(angle * 2.0 + uTime * 0.14 + uPhase), 3.0);
    float depthFade = 1.0 - smoothstep(8.0, 20.0, vDepth);

    float alpha = uOpacity * (0.4 + sheen * 0.85 + vGlow * 1.6) * depthFade;
    vec3 color = mix(uColor, uHighlight, sheen * 0.55 + vGlow * 0.6);

    gl_FragColor = vec4(color, min(alpha, 1.0));

    #include <colorspace_fragment>
  }
`;
