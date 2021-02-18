import { Canvas } from '../../Canvas';
import { BlenderCameraScene } from './WavefrontScene';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(320, 200, new BlenderCameraScene());
        canvas.init();
    }

}

new Application().main();
