import React, { Component } from 'react'
import Recorder from 'recorder-js';
import { Button } from 'antd';
import toWav from 'audiobuffer-to-wav';
import resample from '../../utils/resampler';

export default class WebRecorder extends Component {
    state = {
        init: false,
        audioContext: null,
        recorder: null,
        blob: null,
        isRecording: false
    }

    startRecording = async () => {
        let { recorder } = this.state;
        if (!recorder) {
            try {
                const audioContext = new(window.AudioContext || window.webkitAudioContext)();
                recorder = new Recorder(audioContext);
                this.setState({ recorder, audioContext });
                console.log('recorder: ', recorder);
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                recorder.init(stream)
            } catch (err) {
                console.log('Uh oh... unable to get stream...', err);
            }
        }
        recorder.start()
            .then(() => {
                console.log('Start recording');
                this.setState({ isRecording: true })
            });
    }

    stopRecording = () => {
        const { recorder } = this.state;
        recorder.stop()
            .then(({ blob }) => {
                console.log('Stopped recording');
                this.setState({
                    blob,
                    isRecording: false
                });
            });
    }

    download = () => {
        const { blob } = this.state;
        Recorder.download(blob, 'my-audio-file'); // downloads a .wav file
    }

    dictate = () => {
        const { blob, audioContext } = this.state;
        let fileReader = new FileReader();
        fileReader.onloadend = async () => {
            const arrayBuffer = fileReader.result;
            audioContext.decodeAudioData(arrayBuffer, async (audioBuffer) => {
                const audioData = await resample(audioBuffer, 16000);
                const wav = toWav(audioData);
                this.props.onDictation(wav);
            })
        }
        fileReader.readAsArrayBuffer(blob);
    }

    render() {
        const { isRecording, blob } = this.state;
        return (
            <div>
                <h1>Recorder</h1>
                <div style={styles.recorderContainer}>
                    {
                        isRecording
                        ? <Button onClick={this.stopRecording}>Stop</Button>
                        : <Button type='primary' onClick={this.startRecording}>Record</Button>
                    }
                    {
                        blob && (
                            <div style={styles.operationContainer}>
                                <Button onClick={this.dictate}>Dictate</Button>
                                <Button onClick={this.download}>Download</Button>
                            </div>
                        ) 
                    }
                </div>
                <div>
                    { blob && <audio controls src={URL.createObjectURL(blob)}></audio> }
                </div>
            </div>
        )
    }
}

const styles = {
    recorderContainer: {
        margin: '20px 0',
    },
    operationContainer: {
        display: 'inline-block',
    }
}