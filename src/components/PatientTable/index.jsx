import React, { Component } from 'react'
import {
  Input, InputNumber, Popconfirm, Form
} from 'antd';
import EditableFormTable from '../EditableFormTable';

class PatientTable extends Component {
  _handleChangeData = (update) => {
    console.log('update', update);
  }

  render() {
    const { dataSource } = this.props;
    // Main Data
    const data = dataSource.map((item, i) => ({
      key: i,
      name: item.name,
      gender: item.gender,
      age: item.age,
      telephone: item.telephone,
    }));

    let columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      editable: true,
      sorter: (a, b) => a.name.length - b.name.length,
    }, {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: '12.5%',
      editable: true,
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ],
      onFilter: (value, record) => record.gender.indexOf(value) === 0,
    }, {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: '12.5%',
      editable: true,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Telephone',
      dataIndex: 'telephone',
      key: 'telephone',
      width: '35%',
      editable: true,
    }];

    // SubData
    const subData = dataSource.map((item, i) => ({
      key: `nested-${i}`,
      complaint: item.complaint,
      ill: item.ill,
      diagnosis: item.diagnosis,
    }))

    let subColumns = [
      {
        title: 'Chief complaint',
        dataIndex: 'complaint',
        editable: true,
      }, {
        title: 'Present illness',
        dataIndex: 'ill',
        editable: true,
      }, {
        title: 'Diagnosis',
        dataIndex: 'diagnosis',
        editable: true,
      }
    ];

    return (
      <EditableFormTable
        data={data}
        columns={columns}
        subData={subData}
        subColumns={subColumns}
        onChangeData={this._handleChangeData}
      />
    );
  }
}

export default PatientTable;