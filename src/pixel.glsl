

vec3 viewVector=vec3(1,1,20);
vec3 glowColor=vec3(24,45,34);
float c=.3;
float p=.82;
int intensity=1;
void main()
{
    vec3 vNormal=normalize(normalMatrix*normal);
    vec3 vNormel=normalize(normalMatrix*viewVector);
    intensity=pow(c-dot(vNormal,vNormel),p);
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}

vec3 glowColor;
vec3 viewVector;
vec3 size;
float thickness;
float smoothness;
void main()
{
    float a=smoothstep(thickness,thickness+smoothness,length(abs(viewVector.xy)-size.xy));
    a*=smoothstep(thickness,thickness+smoothness,length(abs(viewVector.yz)-size.yz));
    a*=smoothstep(thickness,thickness+smoothness,length(abs(viewVector.xz)-size.xz));
    
    vec3 glow=glowColor*intensity;
    vec3 glowOutline=mix(glow,vec3(0),a);
    
    gl_FragColor=vec4(glowOutline,1.);
    
}
