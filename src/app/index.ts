/**
 * Load the GeoJSON via ThreeJS
 */
import { BasicScene } from '@/app/BasicScene';

const element = document.getElementById('Canvas1') as HTMLCanvasElement;

const scene = new BasicScene(element);

scene.init();

const resize = () => {
  scene.resize(window.innerWidth, window.innerHeight);
};
resize();
window.addEventListener('resize', resize);
