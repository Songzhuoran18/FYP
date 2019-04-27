import React, { Component } from 'react'
import Recorder from 'recorder-js';
import { Button } from 'antd';

export default class WebRecorder extends Component {
    state = {
        init: false,
        audioContext: null,
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

        this.setState({ recorder, audioContext });
        console.log('recorder: ', recorder);
    }

    startRecording = async () => {
        const { recorder, init } = this.state;
        if (!init) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: {
                    sampleRate: 8000,
                    channelCount: 1, // 声道
                    volume: 1 // 音量
                } })
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
            .then(({ blob }) => {
                console.log('Stopped recording');
                this.setState({ blob, isRecording: false });
            });
    }

    download = () => {
        const { blob } = this.state;
        Recorder.download(blob, 'my-audio-file'); // downloads a .wav file
    }

    dictate = () => {
        const { blob, audioContext } = this.state;
        this.props.onDictation(blob);
        let fileReader = new FileReader();

        let arrayBuffer;

        fileReader.readAsArrayBuffer(blob);
        // fileReader.readAsBinaryString(blob);
        // fileReader.onloadend = () => {
        //     console.log(fileReader.result);
        //     this.props.onDictation(fileReader.result);
        // }
        fileReader.onloadend = () => {
            arrayBuffer = fileReader.result;
        //     // const base64Audio = encodeURI(_arrayBufferToBase64(arrayBuffer));
            audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
                console.log('audioBuffer: ', audioBuffer);
        //     //     this.props.onDictation(audioBuffer);
            })
        //     this.props.onDictation(arrayBuffer);
        }
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