import Framebuffer from './Framebuffer';
import Texture from './Texture';

declare function require(string): string;

export class Canvas {

    private canvas: HTMLCanvasElement;
    private backbufferCanvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private backbufferContext: CanvasRenderingContext2D;
    private framebuffer: Framebuffer;
    start: number;

    private texture: Texture;
    private texture2: Texture;
    private texture3: Texture;
    private texture4: Texture;
    private texture5: Texture;
    private texture6: Texture;

    constructor(width: number, height: number) {
        this.canvas = document.createElement('canvas');

        this.canvas.width = width;
        this.canvas.height = height;

        this.context = this.canvas.getContext('2d');

        this.context.oImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;

        this.backbufferCanvas = document.createElement('canvas');
        this.backbufferCanvas.width = 320;
        this.backbufferCanvas.height = 200;

        this.backbufferContext = this.backbufferCanvas.getContext('2d');
        this.framebuffer = new Framebuffer(320, 200);

        this.start = Date.now();
    }

    /**
     * http://www.hugi.scene.org/online/coding/hugi%20se%204%20-%20index%20sorted%20by%20topic.htm
     * http://www.flipcode.com/archives/The_Art_of_Demomaking-Issue_01_Prologue.shtml
     * http://insolitdust.sourceforge.net/code.html
     * 
     * http://www.wab.com/screen.php?screen=20
     * http://www.helixsoft.nl/articles/circle/sincos.htm
     * https://gamedev.stackexchange.com/questions/24957/doing-an-snes-mode-7-affine-transform-effect-in-pygame
     * https://www.coranac.com/tonc/text/mode7ex.htm
     * 
     * http://codeincomplete.com/posts/javascript-racer-v1-straight/
     * http://www.extentofthejam.com/pseudo/
     * 
     * http://hugi.scene.org/online/hugi24/coding%20graphics%20bonz%20sines%20and%20cosines%20for%20fun%20and%20profit.htm
     * 
     * @memberof Canvas
     */
    public render(): void {
        let time: number = (Date.now() - this.start) % 55000;

        if (time < 5000) {
            this.framebuffer.drawTitanEffect();
            this.framebuffer.shadingTorus(Date.now() * 0.02);
            this.framebuffer.drawTexture(32, 1, this.texture2, 1.0);
            this.framebuffer.drawText(8, 192-18, '3D TORUS', this.texture4);
        } else if (time < 15000) {
            this.framebuffer.drawTexture(0, 0, this.texture5, 1.0);
            this.framebuffer.draw(this.texture);
            this.framebuffer.drawText(8, 192-18, 'TEXTURED TWISTER', this.texture4);
        } else if (time < 25000) {
            this.framebuffer.drawTexture(0, 0, this.texture5, 1.0);
            this.framebuffer.drawLens(this.texture5, this.texture6);
            this.framebuffer.drawText(8, 192-18, '2D LENS EFFECT', this.texture4);
        } else if (time < 30000) {
            this.framebuffer.drawRotoZoomer(this.texture);
            this.framebuffer.shadingDemo(Date.now() * 0.02);
            this.framebuffer.drawText(8, 192-18, 'SHADED 3D CUBE', this.texture4);
        } else if (time < 35000) {
            this.framebuffer.drawRotoZoomer(this.texture);
            this.framebuffer.shadingSphere(Date.now() * 0.01);
            this.framebuffer.drawText(8, 192-18, 'DISTORTED 3D SPHERE', this.texture4);
        } else if (time < 40000) {
            this.framebuffer.drawRotoZoomer(this.texture);
            this.framebuffer.wireFrameSphereClipping(Date.now() * 0.01);
            this.framebuffer.drawText(8, 192-18, 'WIREFRAME SPHERE', this.texture4);
            // this.framebuffer.draw(this.texture);
        } else if (time < 45000) {
            this.framebuffer.drawVoxelLandscape2(this.texture3, time);
            this.framebuffer.drawTexture(32, 1, this.texture2, 1.0);
            this.framebuffer.drawText(8, 192-18, 'VOXEL LANDSCAPE', this.texture4);
        } else if (time < 50000) {
            this.framebuffer.drawWireTunnel(Date.now());
            this.framebuffer.drawText(8, 192-18, 'OLD SCHOOL PLASMA', this.texture4);
        } else {
            // https://www.youtube.com/watch?v=ccYLb7cLB1I&t=773s
            this.framebuffer.drawMetaballs();
            this.framebuffer.drawText(8, 192-18, '2D METABALLS', this.texture4);
        }



        // this.framebuffer.scene9(time*0.01);

        //this.framebuffer.drawText(80 + 0, 100 + 8, '   IN JAVASCRIPT!    ', this.texture4);

        // TODO: text
        // 3d line clipping for fly by :)
        // different transitions:
        // - stripes etc
        // - chessboard
        // wobble logo
        // ball 3d with precalculated sizes lookup
        // starfield 2d /3d
        // tv noise
        // wormhole
        // glitch logo

        /**
         * TODO: lenslfare effect
         * - procedural lens flare textures
         * - lens flare fade in
         * - read zbuffer
         * - http://blackpawn.com/texts/lensflare/
         */
    }

    getImageData(image: HTMLImageElement, withAlpha: boolean = false): Uint32Array {
        let canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        let data = context.getImageData(0, 0, image.width, image.height).data;
        let conv = new Uint32Array(data.length / 4);
        let c = 0;
        for (let i = 0; i < data.length; i += 4) {
            if (withAlpha) {
                conv[c] = (data[i + 3] << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i + 0];
            } else {
                conv[c] = (255 << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i + 0];
            }

            c++;
        }
        return conv;
    }

    public init(): void {
        let img = new Image();
        img.addEventListener("load", () => {
            this.texture = new Texture();
            this.texture.texture = this.getImageData(img);
            this.texture.width = img.width;
            this.texture.height = img.height;


            let img2 = new Image();
            img2.addEventListener("load", () => {
                this.texture2 = new Texture();
                this.texture2.texture = this.getImageData(img2, true);
                this.texture2.width = img2.width;
                this.texture2.height = img2.height;


                let img3 = new Image();
                img3.addEventListener("load", () => {
                    this.texture3 = new Texture();
                    this.texture3.texture = this.getImageData(img3);
                    this.texture3.width = img3.width;
                    this.texture3.height = img3.height;


                    let img4 = new Image();
                    img4.addEventListener("load", () => {
                        this.texture4 = new Texture();
                        this.texture4.texture = this.getImageData(img4, true);
                        this.texture4.width = img4.width;
                        this.texture4.height = img4.height;


                        let img5 = new Image();
                        img5.addEventListener("load", () => {
                            this.texture5 = new Texture();
                            this.texture5.texture = this.getImageData(img5);
                            this.texture5.width = img5.width;
                            this.texture5.height = img5.height;

                            let img6 = new Image();
                            img6.addEventListener("load", () => {
                                this.texture6 = new Texture();
                                this.texture6.texture = this.getImageData(img6, true);
                                this.texture6.width = img6.width;
                                this.texture6.height = img6.height;

                                let myAudio = new Audio(require('./assets/3dGalax.mp3'));
                                myAudio.loop = true;
                                myAudio.play();
                                this.renderLoop();
                            });
                            img6.src = require("./assets/lens.png");


                        });
                        img5.src = require("./assets/atlantis.png");
                    });
                    img4.src = require("./assets/font.png");
                });
                img3.src = require("./assets/heightmap.png");
            });
            img2.src = require("./assets/razor1911.png");
        });
        img.src = require("./assets/logo.png");
    }

    public display(): void {

    }

    public renderLoop(): void {
        this.render();
        this.flipBackbuffer();
        requestAnimationFrame(() => this.renderLoop());
    }

    public flipBackbuffer(): void {
        this.backbufferContext.putImageData(this.framebuffer.getImageData(), 0, 0);
        this.context.drawImage(this.backbufferCanvas, 0, 0, 320, 200, 0, 0, 320 * 2, 200 * 2);
    }

    public appendTo(element: HTMLElement): void {
        element.appendChild(this.canvas);
    }

}