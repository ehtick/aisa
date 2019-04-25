import { BlenderJsonParser } from '../../blender/BlenderJsonParser';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f } from '../../math/Matrix4f';
import { TexturedMesh } from '../../rendering-pipelines/TexturedMesh';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';

export class PlanedeformationTunnelScene extends AbstractScene {

    private metall: Texture;
    private metalheadz: Texture;
    private blenderObjMetal: Array<TexturedMesh>;
    private accumulationBuffer: Uint32Array = new Uint32Array(320 * 200);

    public init(framebuffer: Framebuffer): Promise<any> {
        this.blenderObjMetal = BlenderJsonParser.getBlenderScene(require('../../assets/metalheadz.json'), false);
        return Promise.all([
            TextureUtils.load(require('../../assets/cyber.png'), false).then(
                (texture: Texture) => this.metall = texture
            ),
            TextureUtils.load(require('../../assets/metalheadz.png'), false).then(
                (texture: Texture) => this.metalheadz = texture
            ),
        ]);
    }

    public render(framebuffer: Framebuffer): void {
        const time: number = Date.now();
        const elapsedTime: number = 0.8 * time;
        this.drawPlanedeformationTunnel(framebuffer, Date.now(), this.metall);

        const camera: Matrix4f = this.computeCameraMovement(elapsedTime * 1.0);
        const mv: Matrix4f = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(7, 7, 7));

        framebuffer.clearDepthBuffer();
        framebuffer.setTexture(this.metalheadz);
        for (let j: number = 0; j < this.blenderObjMetal.length; j++) {
            framebuffer.texturedRenderingPipeline.draw(this.blenderObjMetal[j], mv);
        }

        const texture3: Texture = new Texture(this.accumulationBuffer, 320, 200);
        framebuffer.drawTexture(0, 0, texture3, 0.75);
        framebuffer.fastFramebufferCopy(this.accumulationBuffer, framebuffer.framebuffer);
    }

    private computeCameraMovement(elapsedTime: number): Matrix4f {
        return Matrix4f.constructTranslationMatrix(0, 0, -192 + (Math.sin(elapsedTime * 0.00007) * 0.5 + 0.5) * 17)
            .multiplyMatrix(
                Matrix4f.constructXRotationMatrix(elapsedTime * 0.0008).multiplyMatrix(
                    Matrix4f.constructYRotationMatrix(-elapsedTime * 0.0009).multiplyMatrix(
                        Matrix4f.constructTranslationMatrix(0, 0, 0)
                    )
                )
            );
    }

    /**
     * http://sol.gfxile.net/gp/ch17.html
     * TODO:
     * - better textures
     * - precalc lookup tables
     * - fadeout
     * - substraction to create black holes
     */
    private drawPlanedeformationTunnel(framebuffer: Framebuffer, elapsedTime: number, texture2: Texture): void {

        let i = 0;
        for (let y = 0; y < 200; y++) {
            for (let x = 0; x < 320; x++) {
                let xdist = (x - 160 + Math.sin(3 * Date.now() * 0.0001) * 160) + Math.sin(y * 0.3) * 2 * Math.max(Math.sin(elapsedTime * 0.00008), 0);
                let ydist = (y - 100 + Math.cos(2 * Date.now() * 0.00009) * 100) + Math.cos(x * 0.3) * 2 * Math.max(Math.sin(elapsedTime * 0.00008), 0);
                let dist = 256 * 10 / Math.max(1.0, Math.sqrt(xdist * xdist + ydist * ydist)) * 4.4;
                let alpha = 1 - Math.min(1, dist * 0.0026);
                let alpha2 = 1 - alpha;
                dist += elapsedTime * 0.04;

                let angle = (Math.atan2(xdist, ydist) / Math.PI + 1.0) * 256 + elapsedTime * 0.019;

                let color2 = texture2.texture[(dist & 0x1ff) + (angle & 0x1ff) * 512];

                let r = (((color2 >> 0) & 0xff) * (alpha) + (190 * alpha2) & 0xff) | 0;
                let g = (((color2 >> 8) & 0xff) * (alpha) + (255 * alpha2) & 0xff) | 0;
                let b = (((color2 >> 16) & 0xff) * (alpha) + (249 * alpha2) & 0xff) | 0;

                framebuffer.framebuffer[i++] = r | g << 8 | b << 16 | 255 << 24;
            }
        }
    }

}
