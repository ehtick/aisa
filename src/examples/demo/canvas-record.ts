import fileExtension from 'file-loader';

export class CanvasRecorder {

    public getType(filename) {
        const ext = fileExtension(filename);
        return ['mkv'].includes(ext) ? 'video/x-matroska;codecs=avc1' : 'video/webm';
    }

    public createCanvasRecorder(canvas, options = {}, audioCtx) {
        const date = new Date();
        let link = null;

        const {
            filename = `Recording ${date.toISOString().slice(0, 10)} at ${date
                .toTimeString()
                .slice(0, 8)
                .replace(/:/g, '.')}.webm`,
            frameRate = 25,
            download = true,
            recorderOptions = {
                mimeType: 'video/x-matroska;codecs=avc1',
                audioBitsPerSecond: 128000, // 128 Kbit/sec
                videoBitsPerSecond: 2500000 // 2.5 Mbit/sec
            }
        } = {
            ...options
        };

        const mimeType = recorderOptions.mimeType || this.getType(filename);

        if (download) {
            link = link || document.createElement('a');
            link.download = filename;
        }

        let chunks = [];

        let stream = canvas.captureStream(frameRate);

        // get the audio track:
        const ctx = new AudioContext();
        const dest = ctx.createMediaStreamDestination();
        const sourceNode = ctx.createMediaElementSource(audioCtx);
        sourceNode.connect(dest);
        sourceNode.connect(ctx.destination)
        const audioTrack = dest.stream.getAudioTracks()[0];
        stream.addTrack(audioTrack);

        let recorder = new MediaRecorder(stream, { mimeType, ...recorderOptions });

        recorder.ondataavailable = event => {
            event.data.size && chunks.push(event.data);
        };
        recorder.onstop = () => {
            if (download && chunks.length) {
                const blob = new Blob(chunks, { type: mimeType });
                const url = URL.createObjectURL(blob);
                link.href = url;

                const event = new MouseEvent('click');
                link.dispatchEvent(event);
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 1);
            }
        };

        return {
            start(timeslice) {
                chunks = [];
                recorder.start(timeslice);
            },
            set filename(name) {
                link.download = name;
            },
            step() {
                stream.getVideoTracks()[0].requestFrame();
            },
            stop() {
                recorder.stop();

                return chunks;
            },
            dispose() {
                recorder = null;
                stream = null;
            },
            stream,
            recorder
        };
    }

    // module.exports = createCanvasRecorder;
}