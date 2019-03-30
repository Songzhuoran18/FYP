import React, { Component } from 'react'
import {
    Table, Input, InputNumber, Popconfirm, Form
} from 'antd';

const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
  state = {
    dataSource: [],
    data: [],
    editingKey: '' , 
    filteredInfo: '',
    sortedInfo: {
      order: '',
      columnKey: '',
    },
  };

  componentWillReceiveProps(nextProps) {
    const { dataSource } = nextProps;
    if (this.props.dataSource === dataSource) return;
    // console.log('oops')
    this.setState({ dataSource });
    const data = dataSource.map((item, i) => ({
      key: i,
      name: item.name,
      gender: item.gender,
      age: item.age,
      telephone: item.telephone,
    }));
    const subData = dataSource.map((item, i) => ({
      key: `nested-${i}`,
      complaint: item.complaint,
      ill: item.ill,
      diagnosis: item.diagnosis,
    }))
    this.setState({ data, subData });
  }

  isEditing = record => {
    return record.key === this.state.editingKey;
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    // console.log("TCL: EditableTable -> save -> key", key)
    const { data, subData } = this.state;
    const nested = key.toString().startsWith('nested');
    const oldData = nested ? subData : data;
    form.validateFields((error, row) => {
      if (error) {
        console.log(error)
        return;
      }
      const newData = [...oldData];
      const index = newData.findIndex(item => key === item.key);
      // console.log('index', index)
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ [nested ? 'subData' : 'data']: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ [nested ? 'subData' : 'data']: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    // console.log(key)
    this.setState({ editingKey: key });
  }

  handleChange = (pagination, filters, sorter) => {
    // console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  expandedRowRender = ({ key }) => {
    const components = {
      body: {
        cell: EditableCell,
      },
    };
    let columns = [
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
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        render: (text, record) => {
          // console.log('record.key', record.key)
          // console.log('this.state.editingKey', this.state.editingKey)
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        Save
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>Edit</a>
              )}
            </div>
          );
        },
      },
    ]
    columns = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    
    return (
      <Table
        components={components}
        columns={columns}
        dataSource={[this.state.subData[key]]}
        pagination={false}
      />  
    );
  };

  render() {
    const { sortedInfo } = this.state
    const { filteredInfo } = this.state
    let columns = [{
      title: 'Name',
      dataIndex: 'name',
      width: '20%',
      editable: true,
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
    }, {
      title: 'Gender',
      dataIndex: 'gender',
      width: '12.5%',
      editable: true,
      filters: [
        { text: 'Male', value: 'M'},
        { text: 'Female', value: 'F'},
      ],
      filteredValue: filteredInfo.gender,
      onFilter: (value, record) => record.gender.includes(value),
    }, {
      title: 'Age',
      dataIndex: 'age',
      width: '12.5%',
      editable: true,
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
    }, 
    {
      title: 'Telephone',
      dataIndex: 'telephone',
      width: '35%',
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (text, record) => {
        // console.log('record', record)
        const { editingKey } = this.state;
        const editable = this.isEditing(record);
        return (
          <div>
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <a
                      href="javascript:;"
                      onClick={() => this.save(form, record.key)}
                      style={{ marginRight: 8 }}
                    >
                      Save
                    </a>
                  )}
                </EditableContext.Consumer>
                <Popconfirm
                  title="Sure to cancel?"
                  onConfirm={() => this.cancel(record.key)}
                >
                  <a>Cancel</a>
                </Popconfirm>
              </span>
            ) : (
              <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>Edit</a>
            )}
          </div>
          );
       },
      },
    ]
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    columns = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          expandedRowRender={this.expandedRowRender}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
          }}
          onChange={this.handleChange}
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;