import React, { Component } from 'react';
import axios from 'axios';
import PatientTable from './components/PatientTable'
import WebRecorder from './components/WebRecorder'
import logo from './logo.svg';
import { DOMAIN_URL } from './config';
import './App.css';

class App extends Component {
  // global variables
  state = {
    dataSource: [],
  }


  componentDidMount() {
    this._getMedicalRecords();
  }

  _getMedicalRecords = () => {
    axios.get(`${DOMAIN_URL}/userinfo`)
      .then(res => res.data)
      .then(dataSource => this.setState({ dataSource }))
  }

  _handleDictation = (audio) => {
    console.log('audio: ', audio);
    const formData = new FormData();
    formData.append('audio', audio, 'record.wav');
    axios.post(`${DOMAIN_URL}/dictate`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        console.log('res:', res);
      }).catch((err) => {
        console.log('err:', err);
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <WebRecorder onDictation={this._handleDictation} />
          <PatientTable
            dataSource={this.state.dataSource}
          />
        </header>
      </div>
    );
  }
}

export default App;
