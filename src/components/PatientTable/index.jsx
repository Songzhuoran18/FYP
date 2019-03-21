import React, { Component } from 'react'
import { Table, Button } from 'antd';

// const data = [
//   {
//     key: 1, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', 
//     description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
//   },
//   {
//     key: 2, name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', 
//     description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
//   },
//   {
//     key: 3, name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park', 
//     description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
//   },
// ];
// const data = [/
//   axios.get('')
//   // .then(res => res.data)
//   // .then(users => this.setState({ users: users }))
// ]




export default class PatientTable extends Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
  };

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  }

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  }

  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'age',
      },
    });
  }

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filters: [
        { text: 'Joe', value: 'Joe' },
        { text: 'Jim', value: 'Jim' },
      ],
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
    }, {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
    }, {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      filters: [
        { text: 'London', value: 'London' },
        { text: 'New York', value: 'New York' },
      ],
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
    }, {
      title: 'Action', 
      dataIndex: '', 
      key: 'x', 
      render: () => <a href="javascript:;">Delete</a>,
    //   render = {() => (  
    //     <span>
    //     <a href="javascript:;">Modify</a>
    //     <Divider type="vertical" />
    //     <a href="javascript:;">Delete</a>
    //     </span>      
    // )}
    }];
    console.log(this.props.dataSource)
    return (
      <div>
        <div className="table-operations">
          <Button onClick={this.setAgeSort}>Sort age</Button>
          <Button onClick={this.clearFilters}>Clear filters</Button>
          <Button onClick={this.clearAll}>Clear filters and sorters</Button>
        </div>
        <Table
          columns={columns} 
          expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
          dataSource={this.props.dataSource}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}