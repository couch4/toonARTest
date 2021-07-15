import { AdditiveBlending, Color, ShaderMaterial, FrontSide } from 'three'

export const getPixelMaterial = (camera) => {
  const pixelMaterial = new ShaderMaterial({
    uniforms: {
      c: { type: 'f', value: -0.09 },
      p: { type: 'f', value: -2.24 },
      thickness: { type: 'f', value: 2 },
      edgeIntensity: { type: 'f', value: 1 },
      glowColor: { type: 'c', value: new Color(0x2fa5e1) },
      viewVector: { type: 'v3', value: camera.position },
      opacity: { type: 'f', value: 0.62 },
    },
    vertexShader: pixelVertexShader,
    fragmentShader: pixelFragmentShader,
    side: FrontSide,
    blending: AdditiveBlending,
    transparent: true,
  })

  return pixelMaterial
}

export const pixelVertexShader = `
    #ifdef GL_ES
    precision highp float;
    #endif

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
    #extension GL_OES_standard_derivatives : enable
        
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
