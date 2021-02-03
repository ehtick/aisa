import { Color } from '../../core/Color';
import { CullFace } from '../../CullFace';
import { Framebuffer } from '../../Framebuffer';
import { Matrix4f } from '../../math/Matrix4f';
import { AbstractScene } from '../../scenes/AbstractScene';
import { Texture } from '../../texture/Texture';
import { TextureUtils } from '../../texture/TextureUtils';
import { MD2Loader } from './../../model/md2/MD2Loader';
import { MD2Model } from './../../model/md2/MD2Model';
import { ModelViewMatrix } from './ModelViewMatrix';

/**
 * http://tfc.duke.free.fr/coding/mdl-specs-en.html
 * http://tfc.duke.free.fr/coding/md2-specs-en.html
 * https://github.com/mrdoob/three.js/tree/dev/examples/models/md2/ogro
 * http://tfc.duke.free.fr/old/models/md2.htm
 */
export class Md2ModelScene extends AbstractScene {

    private static readonly CLEAR_COLOR: number = Color.SLATE_GRAY.toPackedFormat();

    private ogroTexture: Texture;
    private md2: MD2Model;
    private startTime: number;

    private modelViewMatrix: ModelViewMatrix = new ModelViewMatrix();

    private fpsStartTime: number = Date.now();
    private fpsCount: number = 0;
    private fps: number = 0;

    public init(framebuffer: Framebuffer): Promise<any> {
        framebuffer.texturedRenderingPipeline.setCullFace(CullFace.FRONT);
        this.startTime = Date.now();
        return Promise.all([
            TextureUtils.load(require('../../assets/md2/texture2.jpg'), false).then(
                (texture: Texture) => this.ogroTexture = texture
            ),
            MD2Loader.load(require('../../assets/md2/drfreak.md2')).then(
                (mesh: MD2Model) => this.md2 = mesh
            )
        ]);
    }

    public render(framebuffer: Framebuffer, time: number): void {
        framebuffer.texturedRenderingPipeline.setCullFace(CullFace.FRONT);

        if (time > this.fpsStartTime + 1000) {
            this.fpsStartTime = time;
            this.fps = this.fpsCount;
            this.fpsCount = 0;
        }
        this.fpsCount++;

        framebuffer.clearColorBuffer(Md2ModelScene.CLEAR_COLOR);
        framebuffer.clearDepthBuffer();

        this.computeCameraMovement(time * 0.6);

        framebuffer.setTexture(this.ogroTexture);
        framebuffer.texturedRenderingPipeline.setModelViewMatrix(this.modelViewMatrix.getMatrix());
        framebuffer.texturedRenderingPipeline.draw(framebuffer, this.md2.getMesh(time));
    }

    private computeCameraMovement(elapsedTime: number): void {
        this.modelViewMatrix.setIdentity();
        this.modelViewMatrix.trans(0, 0, -120 + (Math.sin(elapsedTime * 0.0007) * 0.5 + 0.5) * 87);
        this.modelViewMatrix.yRotate(-elapsedTime * 0.006);
        this.modelViewMatrix.xRotate(Math.PI * 2 / 360 * -90);
    }

}
