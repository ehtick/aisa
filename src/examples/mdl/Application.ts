import { Canvas } from '../../Canvas';
import { Md2ModelScene } from './Md2ModelScene';

class Application {

    public main(): void {
        const canvas: Canvas = new Canvas(320, 200, new Md2ModelScene());
        canvas.init();
    }

}

new Application().main();
