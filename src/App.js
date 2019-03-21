import React, { Component } from 'react';
import axios from 'axios';
import UserForm from './components/UserForm'
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
    this.handleRequestUsers()
    // const arr = [1, 4, 3]
    // const result = arr.map((n) => n + 1)
    // console.log('arr', arr)
    // console.log('result', result)
  }

  handleChangeRoot = (value) => {
    
    this.setState({ rootValue: value });
  }

  handleRequestUsers = () => {
    // console.log(777)
    axios.get('http://localhost:5000/testAPI')
      .then(res => res.data)
      .then(dataSource => this.setState({ dataSource }))
  }

  render() {
    console.log('logged:', this.state.dataSource);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/* <p>
            rootValue: {this.state.rootValue}
          </p> */}
          <PatientTable
            dataSource={this.state.dataSource}
          />
          {
            // this.state.users.map((user) => (
            //   <UserForm
            //     key={user.id}
            //     username={user.email}
            //     onRootChange={this.handleChangeRoot}
            //   />
            // ))
          }
        </header>
      </div>
    );
  }
}

export default App;
