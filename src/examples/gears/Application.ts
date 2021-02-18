import { Canvas } from '../../Canvas';
import { GearsScene } from './GearsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new GearsScene());
        canvas.init();
    }

}

Application.main();
