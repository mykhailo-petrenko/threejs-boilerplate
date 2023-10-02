import {
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three';
import { Orbit3DControl } from '@/app/Orbit3DControl';

export class BasicScene {
  NEAR = 0.1;
  FAR = 20000000;

  public scene: Scene;
  public camera: PerspectiveCamera;
  public renderer: WebGLRenderer;
  public control: Orbit3DControl;

  private onResize: () => void;

  private isAnimate: boolean;

  constructor(
    readonly canvas: HTMLCanvasElement
  ) {
    this.isAnimate = false;
  }

  init(): void {
    this.initScenes();
    this.initRenderers();
    this.initCamera();
    this.updateAspect();
    this.initDefaultLights();

    this.onResize = () => {
      this.updateAspect();
      this.render();
    };

    this.onResize();
    window.addEventListener('resize', this.onResize);

    this.startAnimation();
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;

    this.onResize();
  }

  dispose() {
    window.removeEventListener('resize', this.onResize);
    this.stopAnimation();
    this.control.dispose();
  }

  render() {
    this.renderer.clear();

    this.renderer.render(this.scene, this.camera);
  }

  startAnimation() {
    this.isAnimate = true;

    const tick = () => {
      if (!this.isAnimate) {
        return;
      }

      this.render();

      requestAnimationFrame(tick);
    }

    tick();
  }

  stopAnimation() {
    this.isAnimate = false;
  }

  getAspect() {
    return this.canvas.width / this.canvas.height;
  }

  updateAspect() {
    this.camera.aspect = this.getAspect();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.width, this.canvas.height);
  };

  initCamera() {
    this.camera = new PerspectiveCamera(60, this.getAspect(), this.NEAR, this.FAR);

    this.camera.position.set(0, 0, 300000);
    this.camera.lookAt(0, 0, 0);
    this.camera.up.set(0, 0, 1);
  }

  initScenes() {
    this.scene = new Scene();
  }

  initRenderers() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      logarithmicDepthBuffer: true,
      antialias: true,
    });
    this.renderer.autoClear = false;
  }

  initDefaultLights() {
    const direction = new Vector3(1, -1, 2).normalize();
    // Lights
    let light;
    light = new AmbientLight( 0x404040 ); // soft white light
    this.scene.add( light );

    light = new DirectionalLight( 0xffffff, 0.7 );
    light.position.copy(direction);
    this.scene.add( light );

    light = new HemisphereLight( 0xffffbb, 0x080820, 0.7 );
    this.scene.add( light );
  }

  initControl() {
    if (this.control) {
      this.control.dispose();
    }

    this.control = new Orbit3DControl(this.camera, this.canvas);
    this.control.maxDistance = 10000000;
    this.control.minDistance = 100;
    this.control.target.set(0, 0, 0);
  }

}
