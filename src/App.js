import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import axios from 'axios';
import PatientTable from './components/PatientTable'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  // global variables
  state = {
    rootValue: 'root',
    users: [],
    dataSource: [],
  }


  componentDidMount() {
    this.handleRequestInfo();
  }

  handleRequestInfo = () => {
    axios.get('http://192.168.1.200:5000/testAPI')
      .then(res => res.data)
      .then(dataSource => this.setState({ dataSource }))
  }

  render() {
    console.log('logged:', this.state.dataSource);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {
            <div>
              <Button type="primary">Primary</Button>
              <Button>Default</Button>
              <Button type="dashed">Dashed</Button>
              <Button type="danger">Danger</Button>
              <Icon type="folder" theme="filled" />
            </div>
          }
          {
            <PatientTable
              dataSource={this.state.dataSource}
            />
          }
        </header>
      </div>
    );
  }
}

export default App;
