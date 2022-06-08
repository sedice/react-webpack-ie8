import React from 'react';
import BfrCard from '@/components/base/BfrCard';
import PatientInfo from './components/PatientInfo';
import style from './index.module.less';
import { Button, Form, FormComponent, Input, Table, TableProps } from 'antd';

interface CreateAdviceState {
  /** 表格是否在加载中 */
  loading: boolean;
  /** 存储正在编辑的行以及列 */
  editMap: Record<number, string[]>;
  /** 当前选中的列 */
  selectedRowKeys: string[];
  columns: TableProps['columns'];
}

const data: any = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `李大嘴${i}`,
    age: 32,
    address: `西湖区湖底公园${i}号`,
  });
}

const commonStyle = { marginLeft: '8px' };

// antd 没把这玩意儿导出
type FormType = NonNullable<
  InstanceType<typeof FormComponent>['props']['form']
>;

const createTextRender = (
  that: CreateAdvice,
  text: any,
  key: string,
  index: number,
  formOptions?: any
) => {
  if (that.isEditStatus(index!, key)) {
    return (
      <Form.Item>
        <Input
          {...that.props.form.getFieldProps(`${key};${index}`, {
            ...formOptions,
          })}
          type="text"
        />
      </Form.Item>
    );
  }
  return text;
};

class CreateAdvice extends React.Component<
  { form: FormType },
  CreateAdviceState
> {
  constructor(props: any) {
    super(props);

    const { getFieldProps } = this.props.form;

    this.state = {
      selectedRowKeys: [],
      loading: false,
      editMap: {},
      columns: [
        {
          title: '项目名称',
          dataIndex: 'name',
          key: 'name',
          width: 100,
          // fixed: 'left',
          render: (text, record, index) => {
            return createTextRender(this, text, 'name', index!, {
              rules: [
                {
                  required: true,
                  message: 'xxx ',
                },
              ],
            });
          },
        },
        {
          title: '状态',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: '住址',
          dataIndex: 'address',
          key: 'address',
        },
      ],
    };
  }

  isEditStatus = (row: number, col: string) => {
    return this.state.editMap[row]?.includes(col) ?? false;
  };

  onRowClick: any = (record: any, rowIndex: number, event: any) => {
    const target = event.target;
    const parent = target.parentNode;
    let index = -1;
    for (let i = 0; i < parent.childNodes.length; i++) {
      if (parent.childNodes[i] === target) {
        index = i;
        break;
      }
    }
    this.onCellClick(rowIndex, index);
  };
  onCellClick = (rowIndex: number, index: number) => {
    const { columns } = this.state;
    const config = columns[index];
    const key = config.dataIndex!;

    const editMap = this.state.editMap;
    if (!editMap[rowIndex]) {
      editMap[rowIndex] = [];
    }
    if (editMap[rowIndex].indexOf(key) === -1) {
      editMap[rowIndex].push(key);
    }

    this.setState({ editMap });
  };

  handlePause = () => {
    const { form } = this.props;
    form.validateFields((errors, values) => {
      console.log(errors, values);
    });
  };

  render() {
    return (
      <div
        style={{
          height: '100%',
          padding: '16px',
        }}
      >
        <PatientInfo />
        <BfrCard
          title="医嘱详情"
          style={{
            marginTop: '16px',
          }}
          renderToolBar={() => [
            <Button
              key={'pause'}
              style={commonStyle}
              type="primary"
              onClick={this.handlePause}
            >
              暂停
            </Button>,
            <Button key={'modify'} style={commonStyle}>
              修改
            </Button>,
          ]}
        >
          <Form>
            <Table
              rowClassName={(record, index) => {
                return `${style.tableRow} ant-table-row-level-${index}`;
              }}
              pagination={false}
              columns={this.state.columns}
              dataSource={data}
              onRowClick={this.onRowClick}
              size={'default'}
            />
          </Form>
        </BfrCard>
      </div>
    );
  }
}

export default Form.create()(CreateAdvice);
