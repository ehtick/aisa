import { Canvas } from '../../Canvas';
import { CinematicScroller } from './CinematicScroller';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new CinematicScroller());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
