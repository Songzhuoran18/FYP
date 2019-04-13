import React, { Component } from 'react'
import Recorder from 'recorder-js';
import { Button } from 'antd';


export default class WebRecorder extends Component {
    state = {
        url: '',
        init: false,
        recorder: null,
        blob: null,
        isRecording: false
    }

    componentDidMount() {
        const audioContext = new(window.AudioContext || window.webkitAudioContext)();

        const recorder = new Recorder(audioContext, {
            // An array of 255 Numbers
            // You can use this to visualize the audio stream
            // If you use react, check out react-wave-stream
            // onAnalysed: data => console.log(data),
        });

        this.setState({ recorder })
        console.log('recorder: ', recorder);
    }

    startRecording = async () => {
        const { recorder, init } = this.state;
        if (!init) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                recorder.init(stream)
                this.setState({ init })
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
            .then(({ blob, buffer }) => {
                console.log('Stopped recording');
                this.setState({ blob, isRecording: false })
                // buffer is an AudioBuffer
            });
    }

    download = () => {
        const { blob } = this.state;
        Recorder.download(blob, 'my-audio-file'); // downloads a .wav file
    }

    render() {
        const { isRecording, blob } = this.state;
        return (
            <div style={styles.recorderContainer}>
                <h1>Recorder</h1>
                <div >
                    {
                        isRecording
                        ? <Button onClick={this.stopRecording}>Stop</Button>
                        : <Button type='primary' onClick={this.startRecording}>Record</Button>
                    }
                    { blob && <Button onClick={this.download}>Download</Button> }
                    {
                        blob && (
                            <div>
                                <audio controls src={URL.createObjectURL(blob)}></audio>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}

const styles = {
    recorderContainer: {
        margin: '20px 0',
    }
}