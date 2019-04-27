import React, { Component } from 'react'
import axios from 'axios';
import EditableFormTable from '../EditableFormTable';
import { DOMAIN_URL } from '../../config';

class PatientTable extends Component {
  _handleChangeData = (update) => {
    console.log('update', update);
    const { _id, ill, complaint, diagnosis, userInfo } = update;
    console.log('userInfo: ', userInfo);
    axios.put(`${DOMAIN_URL}/userinfo/${_id}`, {
      userInfo,
      ill,
      complaint,
      diagnosis,
    }).then(({ data }) => {
      console.log('data: ', data);
    }).catch((err) => {
      console.log('err: ', err);
    })
  }

  render() {
    const { dataSource } = this.props;
    // Main Data
    const data = dataSource.map(({ _id, userInfo = {} }) => ({
      key: _id,
      name: userInfo.name,
      gender: userInfo.gender,
      age: userInfo.age,
      telephone: userInfo.telephone,
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
    const subData = dataSource.map((item) => ({
      key: `nested-${item._id}`,
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