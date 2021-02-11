import { Vector3f } from '../math';

export class CameraPath {
    public frames: Array<CameraFrame>;
    constructor() {
        this.frames = new Array<CameraFrame>();
    }
}

export class CameraFrame {
    public frame: number;
    public position: Vector3f;
    public rotation: Vector3f;

    constructor(frame: number, position: Vector3f, rotation: Vector3f) {
        this.frame = frame;
        this.position = position;
        this.rotation = rotation;
    }
}
