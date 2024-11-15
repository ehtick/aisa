import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Torus } from '../../geometrical-objects/Torus';
import { Matrix4f } from '../../math/Matrix4f';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { GouraudShadingRenderingPipeline } from '../../rendering-pipelines/GouraudShadingRenderingPipeline';

export class TorusScene extends AbstractScene {

    private razorLogo: Texture;
    private torus: Torus = new Torus();
    private renderingPipeline: GouraudShadingRenderingPipeline;

    public init(framebuffer: Framebuffer): Promise<any> {
        this.renderingPipeline = new GouraudShadingRenderingPipeline(framebuffer);
        this.renderingPipeline.setCullFace(CullFace.BACK);

        return Promise.all([
            TextureUtils.load(require('@assets/razor1911.png'), true).then(
                (texture: Texture) => this.razorLogo = texture
            )
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {

        this.drawTitanEffect(framebuffer, time);
        this.shadingTorus(framebuffer, time * 0.02);
        framebuffer.drawTexture(framebuffer.width / 2 - this.razorLogo.width / 2, 0, this.razorLogo, 1.0);
    }

    public shadingTorus(framebuffer: Framebuffer, elapsedTime: number): void {
        framebuffer.clearDepthBuffer();

        let modelViewMartrix: Matrix4f = Matrix4f.constructYRotationMatrix(elapsedTime * 0.05);
        modelViewMartrix = modelViewMartrix.multiplyMatrix(Matrix4f.constructXRotationMatrix(elapsedTime * 0.08));
        modelViewMartrix = Matrix4f.constructTranslationMatrix(0, 0, -24).multiplyMatrix(modelViewMartrix);

        this.renderingPipeline.draw(framebuffer, this.torus.getMesh(), modelViewMartrix);
    }


    private drawTitanEffect(framebuffer: Framebuffer, time: number) {
        framebuffer.clear();
        const horizontalNum = framebuffer.width / 20;
        const verticalNum = framebuffer.height / 20;

        for (let x = 0; x < horizontalNum; x++) {
            for (let y = 0; y < verticalNum; y++) {

                const scale = ((Math.sin(time * 0.004 + x * 0.7 + y * 0.4) + 1) / 2);
                const size = Math.round(scale * 8 + 1) * 2;
                const offset = (20 / 2 - size / 2) | 0;
                const color = 255 << 24 | (85 * scale) << 16 | (55 * scale) << 8 | (55 * scale);
                framebuffer.drawBox2(x * 20 + offset, y * 20 + offset, size, size, color);
            }
        }

    }

}
