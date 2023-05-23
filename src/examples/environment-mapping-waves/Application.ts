import { Canvas } from '../../Canvas';
import { EnvironmentMappingScene } from './EnvironmentMappingWavesScene';

class Application {

    public static main(): void {
        const canvas: Canvas = new Canvas(320, 200, new EnvironmentMappingScene());
        canvas.init();
    }

}

Application.main();
