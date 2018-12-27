import { Framebuffer } from '../Framebuffer';
import { Vector3f, Vector4f } from '../math';
import { TextureCoordinate, Vertex } from '../Vertex';
import { AbstractClipEdge } from './AbstractClipEdge';

export class BottomClipEdge extends AbstractClipEdge {

    public isInside(p: Vector3f): boolean {
        return p.y >= Framebuffer.minWindow.y;
    }

    public isInside2(p: Vertex): boolean {
        return p.position.y >= Framebuffer.minWindow.y;
    }

    public computeIntersection(p1: Vector3f, p2: Vector3f): Vector3f {
        return new Vector3f(
            Math.round(p1.x + (p2.x - p1.x) * (Framebuffer.minWindow.y - p1.y) / (p2.y - p1.y)),
            Framebuffer.minWindow.y,
            1 / (1 / p1.z + (1 / p2.z - 1 / p1.z) * (Framebuffer.minWindow.y - p1.y) / (p2.y - p1.y)));
    }

    public computeIntersection2(p1: Vertex, p2: Vertex): Vertex {
        const vertex: Vertex = new Vertex();
        vertex.position =
            new Vector4f(
                Math.round(p1.position.x + (p2.position.x - p1.position.x) * (Framebuffer.minWindow.y - p1.position.y) / (p2.position.y - p1.position.y)),
                Framebuffer.minWindow.y,
                1 / (1 / p1.position.z + (1 / p2.position.z - 1 / p1.position.z) * (Framebuffer.minWindow.y - p1.position.y) / (p2.position.y - p1.position.y)));

        const textCoord: TextureCoordinate = new TextureCoordinate();
        const z: number = vertex.position.z;
        textCoord.u = (p1.textureCoordinate.u / p1.position.z + (p2.textureCoordinate.u / p2.position.z - p1.textureCoordinate.u / p1.position.z) * (Framebuffer.minWindow.y - p1.position.y) / (p2.position.y - p1.position.y)) * z;
        textCoord.v = (p1.textureCoordinate.v / p1.position.z + (p2.textureCoordinate.v / p2.position.z - p1.textureCoordinate.v / p1.position.z) * (Framebuffer.minWindow.y - p1.position.y) / (p2.position.y - p1.position.y)) * z;
        vertex.textureCoordinate = textCoord;

        return vertex;
    }

}