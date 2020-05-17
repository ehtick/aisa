import { Canvas } from '../../Canvas';
import { VoxelLandScapeFadeScene } from './VoxelLandcapeFadeScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new VoxelLandScapeFadeScene());
        canvas.appendTo(document.getElementById('aisa'));
        canvas.init();
    }

}

Application.main();
