
export default function resample(audioBuffer, targetSampleRate = 16000) {
    return new Promise((resolve, reject) => {
        try {
            const sourceAudioBuffer = audioBuffer;  // directly received by the audioprocess event from the microphone in the browser

            const TARGET_SAMPLE_RATE = targetSampleRate;
            const offlineCtx = new OfflineAudioContext(sourceAudioBuffer.numberOfChannels, sourceAudioBuffer.duration * sourceAudioBuffer.numberOfChannels * TARGET_SAMPLE_RATE, TARGET_SAMPLE_RATE);
            const buffer = offlineCtx.createBuffer(sourceAudioBuffer.numberOfChannels, sourceAudioBuffer.length, sourceAudioBuffer.sampleRate);
            // Copy the source data into the offline AudioBuffer
            for (let channel = 0; channel < sourceAudioBuffer.numberOfChannels; channel++) {
                buffer.copyToChannel(sourceAudioBuffer.getChannelData(channel), channel);
            }
            // Play it from the beginning.
            const source = offlineCtx.createBufferSource();
            source.buffer = sourceAudioBuffer;
            source.connect(offlineCtx.destination);
            source.start(0);
            offlineCtx.oncomplete = function(e) {
                // `resampled` contains an AudioBuffer resampled at 16000Hz.
                // use resampled.getChannelData(x) to get an Float32Array for channel x.
                const resampled = e.renderedBuffer;
                console.log('resampled: ', resampled);
                // use this float32array to send the samples to the server or whatever
                resolve(resampled);
            }
            offlineCtx.startRendering();
        } catch (e) {
            reject(e);
        }
    })
}
