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
    result: '',
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
    const formData = new FormData();
    formData.append('audio', new Blob([audio]), 'record.wav');
    axios.post(`${DOMAIN_URL}/dictate`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(({ data }) => {
        this.setState({ result: data.data });
        console.log('res:', data);
      }).catch((err) => {
        console.log('err:', err);
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div style={{color: 'red'}}>{this.state.result}</div>
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
