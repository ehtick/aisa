import { Canvas } from '../../Canvas';
import { MetaballsScene } from './MetaballsScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new MetaballsScene());
        canvas.init();
    }

}

Application.main();
