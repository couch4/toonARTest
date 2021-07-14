export const getPixelMaterial = (camera) => {
  const pixelMaterial = new THREE.ShaderMaterial({
    uniforms: {
      c: { type: 'f', value: -0.3 },
      p: { type: 'f', value: -2.11 },
      thickness: { type: 'f', value: 2 },
      edgeIntensity: { type: 'f', value: 0.95 },
      glowColor: { type: 'c', value: new THREE.Color(0x2fa5e1) },
      viewVector: { type: 'v3', value: camera.position },
      opacity: { type: 'f', value: 0.8 },
    },
    vertexShader: pixelVertexShader,
    fragmentShader: pixelFragmentShader,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
  })

  return pixelMaterial
}

export const pixelVertexShader = `
    varying vec3 viewVector;
    varying vec2 vUv;
    uniform float c;
    uniform float p;
    varying float intensity;
    void main() 
    {
        vUv = uv;
        vec3 vNormal = normalize( normalMatrix * normal );
        vec3 vNormel = normalize( normalMatrix * viewVector );
        intensity = pow( p, c-dot(vNormal, vNormel) );
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`

export const pixelFragmentShader = `
    //#extension GL_OES_standard_derivatives : enable
        
    varying vec2 vUv;
    uniform float thickness;
    uniform float edgeIntensity;
    uniform float opacity;
    uniform vec3 glowColor;
    varying float intensity;
    varying vec3 viewVector;
    
    float edgeFactor(vec2 p){
        vec2 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p) / thickness;
        return min(grid.x, grid.y);
    }

    void main() {
            
        float a = edgeFactor(vUv);
        
        vec3 glowBorder = glowColor / edgeIntensity;
        vec3 glow = glowColor * intensity;
        vec3 c = mix(glowBorder, glow, a);
        
        gl_FragColor = vec4(c, opacity);
    }
`

// export const pixelFragmentShader = `
//     uniform vec3 glowColor;
//     varying float intensity;
//     varying vec3 viewVector;
//     uniform vec3 size;
//     uniform float thickness;
//     uniform float smoothness;
//     uniform float edgeIntensity;
//     void main()
//     {
//         float a = smoothstep(thickness, thickness + smoothness, length(abs(viewVector.xy) - size.xy));
//         a *= smoothstep(thickness, thickness + smoothness, length(abs(viewVector.yz) - size.yz));
//         a *= smoothstep(thickness, thickness + smoothness, length(abs(viewVector.xz) - size.xz));

//         vec3 glow = glowColor * intensity;
//         vec3 glowBorder = glowColor * edgeIntensity;
//         vec3 glowOutline = mix(vec3(0), vec3(1), a);

//         gl_FragColor.rgb = vec3(glowColor, 1.0);
//         gl_FragColor.a = intensity

// }
// `

// gl_FragColor = vec4(c, 1.0);

// vec3 glow = glowColor * intensity;
// gl_FragColor = vec4( glow, 1.0 );
