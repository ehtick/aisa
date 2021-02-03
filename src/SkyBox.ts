import { Framebuffer } from './Framebuffer';
import { Matrix4f, Vector4f } from './math';
import { Texture, TextureUtils } from './texture';
import { TextureCoordinate } from './TextureCoordinate';

export class SkyBox {

    private back: Texture;
    private down: Texture;
    private front: Texture;
    private left: Texture;
    private right: Texture;
    private up: Texture;

    public init(): Promise<any> {
        return Promise.all([
            TextureUtils.load(require('./assets/skybox/skybox_back.png'), false).then(
                (texture: Texture) => this.back = texture
            ),
            TextureUtils.load(require('./assets/skybox/skybox_down.png'), false).then(
                (texture: Texture) => this.down = texture
            ),
            TextureUtils.load(require('./assets/skybox/skybox_front.png'), false).then(
                (texture: Texture) => this.front = texture
            ),
            TextureUtils.load(require('./assets/skybox/skybox_left.png'), false).then(
                (texture: Texture) => this.left = texture
            ),
            TextureUtils.load(require('./assets/skybox/skybox_right.png'), false).then(
                (texture: Texture) => this.right = texture
            ),
            TextureUtils.load(require('./assets/skybox/skybox_up.png'), false).then(
                (texture: Texture) => this.up = texture
            )]);
    }

    // move code from framebuffer into draw method!
    public draw(framebuffer: Framebuffer, mv: Matrix4f): void {
        this.drawSkyBox(framebuffer, mv.getRotation());
    }

    public drawSkyBox(framebuffer: Framebuffer, rotation: Matrix4f): void {
        const sclae = 20;
        const textures = [
            this.back,
            this.left,
            this.front,
            this.right
        ];

        let camera: Matrix4f;
        let mv: Matrix4f;
        let skyBoxSideModel: any;

        const skyPoints = [
            new Vector4f(1, 1, -1, 1),
            new Vector4f(-1, 1, -1, 1),
            new Vector4f(-1, -1, -1, 1),
            new Vector4f(1, 1, -1, 1),
            new Vector4f(-1, -1, -1, 1),
            new Vector4f(1, -1, -1, 1)
        ];

        for (let i = 0; i < 4; i++) {
            camera =
                rotation.multiplyMatrix(
                    Matrix4f.constructXRotationMatrix(Math.PI).multiplyMatrix(
                        Matrix4f.constructYRotationMatrix(+ Math.PI * 2 / 4 * i)));


            mv = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(sclae, sclae, sclae));


            // skybox: starz
            skyBoxSideModel = {
                normals: [],
                normals2: [],
                points: skyPoints,
                points2: skyPoints.map(x => new Vector4f(0, 0, 0)),
                uv: [
                    new TextureCoordinate(1, 1),
                    new TextureCoordinate(0, 1),
                    new TextureCoordinate(0, 0),
                    new TextureCoordinate(1, 1),
                    new TextureCoordinate(0, 0),
                    new TextureCoordinate(1, 0),
                ],
                faces: [
                    {
                        vertices: [0, 1, 2],
                        uv: [0, 1, 2]
                    },
                    {
                        vertices: [3, 4, 5],
                        uv: [3, 4, 5]
                    }
                ]
            };

            framebuffer.setTexture(textures[i]);
            framebuffer.texturedRenderingPipeline.setModelViewMatrix(mv);
            framebuffer.texturedRenderingPipeline.draw(framebuffer, skyBoxSideModel);

        }

        camera = rotation.multiplyMatrix(
            Matrix4f.constructXRotationMatrix(Math.PI)).multiplyMatrix(
                Matrix4f.constructYRotationMatrix(0)
                    .multiplyMatrix(Matrix4f.constructYRotationMatrix(Math.PI * 2 / 4 * 1).multiplyMatrix(Matrix4f.constructXRotationMatrix(-Math.PI * 2 / 4)))
            );


        mv = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(sclae, sclae, sclae));

        // skybox: starz
        skyBoxSideModel = {
            normals: [],
            normals2: [],
            points: skyPoints,
            points2: skyPoints.map(x => new Vector4f(0, 0, 0)),
            uv: [
                new TextureCoordinate(0, 0),
                new TextureCoordinate(1, 0),
                new TextureCoordinate(1, 1),
                new TextureCoordinate(0, 0),
                new TextureCoordinate(1, 1),
                new TextureCoordinate(0, 1),
            ],
            faces: [
                {
                    vertices: [0, 1, 2],
                    uv: [0, 1, 2]
                },
                {
                    vertices: [3, 4, 5],
                    uv: [3, 4, 5]
                }
            ]
        };

        framebuffer.setTexture(this.up);
        framebuffer.texturedRenderingPipeline.setModelViewMatrix(mv);
        framebuffer.texturedRenderingPipeline.draw(framebuffer, skyBoxSideModel);


        camera =
            rotation.multiplyMatrix(
                Matrix4f.constructXRotationMatrix(Math.PI)).multiplyMatrix(
                    Matrix4f.constructYRotationMatrix(0)
                        .multiplyMatrix(Matrix4f.constructYRotationMatrix(Math.PI * 2 / 2).multiplyMatrix(Matrix4f.constructXRotationMatrix(Math.PI * 2 / 4)))

                );


        mv = camera.multiplyMatrix(Matrix4f.constructScaleMatrix(sclae, sclae, sclae));

        // skybox: starz
        skyBoxSideModel = {
            normals: [],
            normals2: [],
            points: skyPoints,
            points2: skyPoints.map(x => new Vector4f(0, 0, 0)),
            uv: [
                new TextureCoordinate(1, 1),
                new TextureCoordinate(0, 1),
                new TextureCoordinate(0, 0),
                new TextureCoordinate(1, 1),
                new TextureCoordinate(0, 0),
                new TextureCoordinate(1, 0),
            ],
            faces: [
                {
                    vertices: [0, 1, 2],
                    uv: [0, 1, 2]
                },
                {
                    vertices: [3, 4, 5],
                    uv: [3, 4, 5]
                }
            ]
        };

        framebuffer.setTexture(this.down);
        framebuffer.texturedRenderingPipeline.setModelViewMatrix(mv);
        framebuffer.texturedRenderingPipeline.draw(framebuffer, skyBoxSideModel);
    }

}
