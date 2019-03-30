import React, { Component } from 'react'
import {
    Input, InputNumber, Popconfirm, Form
} from 'antd';
import EditableFormTable from '../EditableFormTable';

class PatientTable extends Component {
  render() {
    const { dataSource } = this.props;
    return (
      <EditableFormTable
      />
    );
  }
}

export default PatientTable;