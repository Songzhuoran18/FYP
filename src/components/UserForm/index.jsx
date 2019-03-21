import React, { Component } from 'react'
import './index.css'

export default class UserForm extends Component {
    state= {
        inputname: 'xxx'
    }

    handleInputchange = (e) => {
        this.setState({ inputname: e.target.value })
    }

    render() {
        return (
        <div className='userform'>
            userform of {this.props.username}
            <input value={this.state.inputname} onChange={this.handleInputchange} />
            {
                // inputname: {this.state.inputname}
            }
            <button onClick={() => this.props.onRootChange(this.state.inputname)}>changeRoot</button>
        </div>
        )
    }
}
