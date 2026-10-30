import {useEffect,useRef} from 'react';
import * as THREE from 'three';


const vertex='varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}';
const fragment=[
'precision highp float;varying vec2 vUv;uniform sampler2D uVideo;uniform vec2 uResolution,uImageResolution;uniform vec3 uTrail[16];uniform float uHover,uZen;',
'void main(){vec2 uv=vUv;float a=uResolution.x/uResolution.y;float b=uImageResolution.x/uImageResolution.y;vec2 scale=vec2(min(a/b,1.),min(b/a,1.));vec2 cover=(uv-.5)*scale+.5;vec2 distortion=vec2(0.);',
'for(int i=0;i<16;i++){vec3 p=uTrail[i];vec2 dir=uv-p.xy;dir.x*=a;float d=max(length(dir),.001);float age=p.z;float radius=age*.28;float envelope=1.-smoothstep(0.,.052+age*.088,abs(d-radius));float fade=(1.-smoothstep(.08,.98,age))*smoothstep(0.,.03,age);float zenWave=sin((d-radius)*38.)*envelope*fade;float islandWave=sin(d*40.-age*30.)*(1.-smoothstep(0.,.1+age*.3,d))*(1.-smoothstep(0.,1.,age));distortion+=(dir/d)*mix(islandWave,zenWave,uZen)*.024;}',
'float mask=mix(1.,1.-smoothstep(.31,.38,cover.y),uZen);vec2 target=cover+distortion*mask*uHover;gl_FragColor=texture2D(uVideo,clamp(target,.001,.999));}'
].join('\n');
export default function Ripple({src,zen=false,trackRef}){
 const ref=useRef(null);
 useEffect(()=>{
  const mount=ref.current;if(!mount)return;let renderer,frame,trigger,dead=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const video=document.createElement('video');video.src=src;video.crossOrigin='anonymous';video.muted=true;video.loop=zen;video.playsInline=true;video.preload='auto';video.setAttribute('webkit-playsinline','');video.style.display='none';mount.append(video);
  const play=()=>{if(zen&&!reduced)video.play().catch(()=>{});};
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{video.style.cssText='position:absolute;width:100%;height:100%;object-fit:cover';play();return()=>{video.pause();video.remove();};}
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));mount.append(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,0,2);camera.position.z=1;
  const texture=new THREE.VideoTexture(video);texture.colorSpace=THREE.SRGBColorSpace;
  const trail=Array.from({length:16},()=>new THREE.Vector3(-10,-10,1));
  const uniforms={uVideo:{value:texture},uResolution:{value:new THREE.Vector2(1,1)},uImageResolution:{value:new THREE.Vector2(1183,511)},uTrail:{value:trail},uHover:{value:0},uZen:{value:zen?1:0}};
  const geometry=new THREE.PlaneGeometry(2,2,128,128),material=new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms});scene.add(new THREE.Mesh(geometry,material));
  let index=0,hover=0,lastX=-10,lastY=-10,prev=performance.now();
  const stamp=(x,y)=>{trail[index].set(x,y,0);index=(index+1)%16;};
  const pointer=e=>{const r=mount.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=1-(e.clientY-r.top)/r.height;hover=1;if(Math.hypot(x-lastX,y-lastY)>.006){stamp(x,y);lastX=x;lastY=y;}};
  const click=e=>{pointer(e);stamp(lastX,lastY);play();};const leave=()=>hover=0;
  const resize=()=>{renderer.setSize(mount.clientWidth,mount.clientHeight);uniforms.uResolution.value.set(mount.clientWidth,mount.clientHeight);};resize();
  const metadata=()=>{if(dead)return;uniforms.uImageResolution.value.set(video.videoWidth,video.videoHeight);play();};
  video.addEventListener('loadedmetadata',metadata);video.addEventListener('canplay',play);window.addEventListener('pointerdown',play);window.addEventListener('touchstart',play,{passive:true});window.addEventListener('resize',resize);
  const surface=mount.parentElement;surface.addEventListener('pointermove',pointer);surface.addEventListener('pointerdown',click);surface.addEventListener('pointerleave',leave);
  const tick=now=>{if(dead)return;const dt=Math.min((now-prev)/16.667,3);prev=now;for(const p of trail)p.z=Math.min(1,p.z+dt*(zen?.007:.015));uniforms.uHover.value+=(hover-uniforms.uHover.value)*.05;if(!reduced||video.readyState>=2)renderer.render(scene,camera);frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);
  return()=>{dead=true;cancelAnimationFrame(frame);trigger?.kill();video.pause();video.removeAttribute('src');video.load();video.remove();video.removeEventListener('loadedmetadata',metadata);video.removeEventListener('canplay',play);window.removeEventListener('pointerdown',play);window.removeEventListener('touchstart',play);window.removeEventListener('resize',resize);surface.removeEventListener('pointermove',pointer);surface.removeEventListener('pointerdown',click);surface.removeEventListener('pointerleave',leave);geometry.dispose();material.dispose();texture.dispose();renderer.dispose();renderer.domElement.remove();};
 },[src,zen,trackRef]);return <div className="visual" ref={ref}/>;
}
