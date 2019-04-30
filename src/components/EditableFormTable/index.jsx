/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { Component } from 'react'
import {
    Table, Input, InputNumber, Popconfirm, Form, Button
} from 'antd';
import uuid from 'uuidv4';

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
                    // rules: [{
                    //   required: true,
                    //   message: `Please Input ${title}!`,
                    // }],
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
    data: [],
    subData: [],
    editingKey: '' , 
    filteredInfo: '',
    sortedInfo: {
      order: '',
      columnKey: '',
    },
  };

  componentDidMount() {
    const { data, subData } = this.props;
    this.setState({ data, subData });
  }

  componentWillReceiveProps(nextProps) {
    const { data, subData } = nextProps;
    const { data: oldData, subData: oldSubData } = this.props;
    if (oldData === data && oldSubData === subData) return;
    this.setState({ data, subData });
  }

  isEditing = record => {
    return record.key === this.state.editingKey;
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save = (form, key) => {
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
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
      } else {
        newData.push(row);
      }
      this.setState({ [nested ? 'subData' : 'data']: newData, editingKey: '' }, () => {
        // Update data to the outside
        const update = {
          ...this.state.subData[index], // be first to keep main key
          userInfo: this.state.data[index],
          _id: this.state.data[index].key
        };
        if (update._id.includes('temp')) { // New data
          this.props.onAddRow(update);
        } else { // update existing
          this.props.onChangeData(update);
        }
      });
    });
  }

  delete = (key) => {
    const { data, subData } = this.state;
    const newData = [...data];
    const newSubData = [...subData];
    const index = newData.findIndex(item => key === item.key);
    console.log('index', index);
    if (index !== -1){
      this.setState({ data: newData, subData: newSubData, editingKey: '' }, () => {
        this.props.onDeleteRow({
          _id: data[index].key,
        });
      });
      newData.splice(index,1);
    }
  }

  add = () => {
    const { data, subData } = this.state;
    const { columns, subColumns } = this.props;
    const newData = [...data];
    const newSubData = [...subData];
    const dataTemplate = columns.reduce((acc, cur) => ({ ...acc, [cur.dataIndex]: '' }), {});
    const subDataTemplate = subColumns.reduce((acc, cur) => ({ ...acc, [cur.dataIndex]: ' ' }), {});
    const tempId = `temp-${uuid()}`;
    newData.unshift({
      ...dataTemplate,
      key: tempId,
    });
    newSubData.unshift({
      ...subDataTemplate,
      key: `nested-${tempId}`,
    });
    this.setState({ data: newData, subData: newSubData, editingKey: tempId });
  }

  edit = (key) => {
    this.setState({ editingKey: key });
  }

  handleChange = (pagination, filters, sorter) => {
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

    let { subColumns } = this.props;
    subColumns = subColumns.map((col) => {
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

    subColumns.push(
      {
        title: 'Operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <div className="">
                        <a
                          href="javascript:;"
                          onClick={() => this.save(form, record.key)}
                          style={{ marginRight: 8 }}
                        >
                          Save
                        </a>
                      </div>
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
    );

    const dataSource = this.state.subData.filter(item => item.key === `nested-${key}`)
    
    return (
      <Table
        components={components}
        columns={subColumns}
        dataSource={dataSource}
        pagination={false}
      />  
    );
  };

  render() {
    const { sortedInfo } = this.state
    const { filteredInfo } = this.state
    let { columns } = this.props;

    columns = columns.map((col) => {
      if (col.sorter) {
        col.sortOrder = sortedInfo.columnKey === col.dataIndex && sortedInfo.order;
      }
      if (col.filters) {
        col.filteredValue = filteredInfo.gender;
        col.onFilters = (value, record) => record[col.dataIndex].includes(value);
      }
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

    columns.push({
      title: 'Operation',
      dataIndex: 'operation',
      render: (text, record) => {
        const { editingKey } = this.state;
        const editable = this.isEditing(record);
        return (
          <div>
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <div className="">
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        Save
                      </a>
                      <a
                        href="javascript:;"
                        onClick={() => this.delete(record.key)}
                        style={{ marginRight: 8 }}
                      >
                        Delete
                      </a>
                    </div>
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
    });

    const components = {
      body: {
        cell: EditableCell,
      },
    };
    
    return (
      <EditableContext.Provider value={this.props.form}>
        <Button onClick={this.add}>Add</Button>
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