import React from 'react';
import BfrCard from '@/components/base/BfrCard';
import PatientInfo from './components/PatientInfo';
import style from './index.module.less';
import BfrLoading from '@/components/base/BfrLoading';
import { debounce } from '@/utils';
import {
  Button,
  Form,
  FormComponent,
  Input,
  Spin,
  Table,
  TableProps,
} from 'antd';

interface DataType {
  key: string | number;
  name: string;
  age: string | number;
  address: string;
}

interface CreateAdviceState {
  /** 表格是否在加载中 */
  loading: boolean;
  /** 存储正在编辑的行以及列 */
  editMap: Record<number, string[]>;
  /** 当前选中的列 */
  selectedRowKeys: string[];
  /** 列配置 */
  columns: TableProps['columns'];
  /** 表格滚动宽度 */
  tableScrollYHeight: number;
  /** 卡片高度，动态计算 */
  tableCardHeight: 'auto' | number;
  /** 当前状态 修改 or 新增 or 正常 */
  operMode: 'modify' | 'create' | 'normal';
  /** 数据源 */
  datasource: DataType[];
}

const data: DataType[] = [];
for (let i = 0; i < 3; i++) {
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
          size="small"
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
  tableCardRef = React.createRef<HTMLDivElement>();
  adaptTableHeightDebounced?: () => void;

  constructor(props: any) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      loading: false,
      editMap: {},
      tableScrollYHeight: 300,
      tableCardHeight: 'auto',
      operMode: 'normal',
      datasource: [],
      columns: [
        {
          title: '项目名称',
          dataIndex: 'name',
          key: 'name',
          width: 100,
          fixed: 'left',
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
          width: 100,
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

  // 这是一个hack写法,因为antd没有暴露出来对应的方法
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
  /**
   * 单元格编辑
   * @param rowIndex 行
   * @param colIndex 列
   */
  onCellClick = (rowIndex: number, colIndex: number) => {
    if (this.state.operMode === 'create') {
      return;
    }

    const { columns } = this.state;
    const config = columns[colIndex];
    const key = config.dataIndex!;

    // 将对应行的对应列设置为编辑状态
    const editMap = this.state.editMap;
    if (!editMap[rowIndex]) {
      editMap[rowIndex] = [];
    }
    if (editMap[rowIndex].indexOf(key) === -1) {
      editMap[rowIndex].push(key);
    }

    this.setState({ editMap, operMode: 'modify' });
  };

  /**
   * 动态调节卡片高度和table的滚动高度
   */
  adaptTableHeight = () => {
    const windowHeight = $(window).height();
    const top = $(this.tableCardRef.current!).offset()?.top;
    const tableScrollYHeight = windowHeight - top! - 186;
    this.setState({
      tableScrollYHeight,
      tableCardHeight: windowHeight - top! - 16,
    });
  };
  componentDidMount() {
    this.requestData();
    this.adaptTableHeight();
    this.adaptTableHeightDebounced = debounce(this.adaptTableHeight);
    $(window).bind('resize', this.adaptTableHeightDebounced);
  }
  componentWillUnmount() {
    $(window).unbind('resize', this.adaptTableHeightDebounced);
  }

  handleSave = () => {
    const { operMode } = this.state;
    if (operMode === 'normal') {
      return;
    }

    const { form } = this.props;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    form.validateFields((errors: any, values: any) => {
      console.log(errors, values);
    });
  };

  handleCancel = () => {
    const { operMode, editMap, datasource } = this.state;

    // 新增模式下，找到最小的列，把后续的都删除掉
    if (operMode === 'create') {
      const min = Math.min(...Object.keys(editMap).map(Number));
      const newDataSource = [...datasource];
      newDataSource.splice(min, 999 /* 这里如果不传第二个参数在ie8上会无效 */);
      this.setState({
        datasource: newDataSource,
      });
    }

    this.setState({
      editMap: {},
      operMode: 'normal',
    });
    const { form } = this.props;
    form.resetFields();
  };

  handleCreate = () => {
    if (this.state.operMode === 'modify') {
      return;
    }
    this.setState({
      operMode: 'create',
    });
    const { datasource, columns, editMap } = this.state;
    const copyed = [...datasource];

    copyed.push({
      key: Math.random(),
      name: '',
      age: '',
      address: '',
    });
    const len = copyed.length - 1;
    const keys = columns.map((i) => i.dataIndex!);
    const copyedEditMap = { ...editMap };
    copyedEditMap[len] = keys;
    this.setState({
      datasource: copyed,
      editMap: copyedEditMap,
    });
  };

  handleRefresh = () => {
    if (this.state.operMode !== 'normal') {
      return;
    }
    this.requestData();
  };
  requestData() {
    this.setState({
      loading: true,
    });
    return new Promise<DataType[]>((res) => {
      setTimeout(() => {
        res(data);
      }, 1000);
    })
      .then((data) => {
        this.setState({
          datasource: data,
        });
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }

  render() {
    return (
      <div
        style={{
          height: '100%',
          padding: '16px',
        }}
      >
        <PatientInfo />
        <BfrLoading loading={this.state.loading}>
          <BfrCard
            wrapperRef={this.tableCardRef}
            title="医嘱详情"
            style={{
              marginTop: '16px',
              height: this.state.tableCardHeight,
            }}
            renderToolBar={() => [
              <Button
                key={'pause'}
                style={commonStyle}
                type="primary"
                onClick={this.handleSave}
                disabled={this.state.operMode === 'normal'}
              >
                保 存
              </Button>,
              <Button
                key={'modify'}
                style={commonStyle}
                type="ghost"
                onClick={this.handleCancel}
                disabled={this.state.operMode === 'normal'}
              >
                取 消
              </Button>,
              <Button
                key={'modify'}
                style={commonStyle}
                type="ghost"
                onClick={this.handleRefresh}
                disabled={this.state.operMode !== 'normal'}
              >
                刷 新
              </Button>,
            ]}
          >
            <Form>
              <Table
                rowClassName={(record, index) => {
                  return `${style.tableRow} ant-table-row-level-${index}`;
                }}
                useFixedHeader
                pagination={false}
                columns={this.state.columns}
                dataSource={this.state.datasource}
                onRowClick={this.onRowClick}
                size={'default'}
                scroll={{
                  x: 300,
                  y: this.state.tableScrollYHeight,
                }}
              />
              <div
                className={`${style.button_create} ${
                  this.state.operMode === 'modify'
                    ? style['button_create--disabled']
                    : ''
                }`}
                onClick={this.handleCreate}
              >
                新 增
              </div>
            </Form>
          </BfrCard>
        </BfrLoading>
      </div>
    );
  }
}

export default Form.create()(CreateAdvice);
