import { Canvas } from '../../Canvas';
import { BlockFade } from './BlockFade';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new BlockFade());
        canvas.init();
    }

}

Application.main();
