import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Badge,
  Button,
  Avatar,
  Modal,
  Form,
  DatePicker,
  Select,
  Row,
  Col,
  Checkbox,
} from 'antd';
import Link from 'umi/link';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';

import styles from './TaskList.less';

const FormItem = Form.Item;
// const RadioButton = Radio.Button;
// const RadioGroup = Radio.Group;
const SelectOption = Select.Option;

@connect(({ list, task, loading }) => ({
  list,
  task,
  loading: loading.models.list,
}))
@Form.create()
class TaskList extends PureComponent {
  state = {
    visible: false,
    done: false,
    token: JSON.parse(localStorage.getItem('card-poj-token')),
    total: 10,
    selected: [],
    allSelected: false,
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { token } = this.state;
    const page = +localStorage.getItem('page-task3');
    dispatch({
      type: 'task/fetch',
      payload: {
        ...token,
        pageSize: 10,
        pageIndex: page ? page - 1 : 0,
        status: 1,
        shop_status: 5,
      },
    });

    axios({
      method: 'get',
      url: 'https://api.totolelanzhou.com/admin/tasks_count',
      params: { ...token, status: -2 },
      adapter: jsonpAdapter,
    }).then(res => {
      this.setState({
        total: res.data.data,
      });
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
    window.location.reload();
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { token } = this.state;

    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'task/create',
        payload: { ...token, ...fieldsValue },
      });
    });
  };

  handleAllSelect = () => {
    let {
      task: { list },
    } = this.props;
    let { allSelected } = this.state;

    list = list.map(val => val.id);

    allSelected = !allSelected;
    this.setState({
      selected: allSelected ? list : [],
      allSelected,
    });
  };

  handleSelect = selected => {
    const {
      task: { list },
    } = this.props;

    this.setState({
      selected,
      allSelected: selected.length === list.length,
    });
  };

  handleConfirmSelected = async () => {
    const { selected, token } = this.state;
    const {
      task: { list },
      dispatch,
    } = this.props;

    if (!selected.length) return;

    const users = selected.map(val => list.find(item => item.id === val).user.id);

    await dispatch({
      type: 'task/passTasks',
      payload: {
        ...token,
        tasks: selected,
        users,
      },
    });

    const page = +localStorage.getItem('page-task3');
    await dispatch({
      type: 'task/fetch',
      payload: {
        ...token,
        pageSize: 10,
        pageIndex: page ? page - 1 : 0,
        status: 1,
        shop_status: 5,
      },
    });

    this.setState({
      selected: [],
      allSelected: false,
    });
  };

  render() {
    const {
      task: { list },
      loading,
      dispatch,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { token, visible, done, current = {}, total, allSelected, selected } = this.state;

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const extraContent = (
      <div className={styles.extraContent}>
        {/* <RadioGroup
          defaultValue="all"
          onChange={e => {
            e.preventDefault();
            dispatch({
              type: 'task/filter',
              payload: {
                ...token,
                status: e.target.value,
              },
            });
          }}
        >
          <RadioButton value="-1">全部</RadioButton>
          <RadioButton value="-2">进行中</RadioButton>
          <RadioButton value="1">审核中</RadioButton>
          <RadioButton value="2">已完成</RadioButton>
          <RadioButton value="3">已驳回</RadioButton>
        </RadioGroup> */}
      </div>
    );

    const ListContent = ({ data }) => {
      let dom = '';
      switch (+data.status) {
        case 0:
          dom = <Badge status="default" text="未领取" />;
          break;
        case 1:
          dom = <Badge status="processing" text="审核中" />;
          break;
        case 2:
          dom = <Badge status="success" text="已完成" />;
          break;
        case 3:
          dom = <Badge status="error" text="已驳回" />;
          break;
        case 4:
          dom = <Badge status="error" text="已过期" />;
          break;
        default:
          break;
      }
      return (
        <div className={styles.listContent}>
          <div className={styles.listContentItem}>
            <span>执行人</span>
            <p>
              <Link to={`/users/profile?id=${data.user.id}`}>{data.user.name}</Link>
            </p>
          </div>
          <div className={styles.listContentItem}>
            <span>开始时间</span>
            <p>{moment(data.begin_time).format('YYYY-MM-DD')}</p>
          </div>
          <div className={styles.listContentItem}>
            <span>结束时间</span>
            <p>{moment(data.end_time).format('YYYY-MM-DD')}</p>
          </div>
          <div className={styles.listContentItem}>{dom}</div>
        </div>
      );
    };

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="创建成功"
            description="您已成功为所有认证用户发布了任务，因数据量较大，现为您刷新页面获取最新数据。"
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="开始时间" {...this.formLayout}>
            {getFieldDecorator('begin_time', {
              rules: [{ required: true, message: '请选择开始时间' }],
              initialValue: current.begin_time ? moment(current.begin_time) : null,
            })(<DatePicker placeholder="请选择" format="YYYY-MM-DD" style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem label="截止时间" {...this.formLayout}>
            {getFieldDecorator('end_time', {
              rules: [{ required: true, message: '请选择截止时间' }],
              initialValue: current.end_time ? moment(current.end_time) : null,
            })(<DatePicker placeholder="请选择" format="YYYY-MM-DD" style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem label="任务负责人" {...this.formLayout}>
            {getFieldDecorator('owner', {
              rules: [{ required: true, message: '请选择任务负责人' }],
              initialValue: current.owner,
            })(
              <Select placeholder="请选择">
                <SelectOption value="all">全部</SelectOption>
              </Select>
            )}
          </FormItem>
        </Form>
      );
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="任务列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Row type="flex" justify="center" align="middle">
              <Col span={3}>
                <Checkbox checked={allSelected} onChange={this.handleAllSelect}>
                  全选
                </Checkbox>
              </Col>
              <Col span={4}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.handleConfirmSelected(true);
                  }}
                >
                  通过审核
                </Button>
              </Col>
              <Col span={4}>
                <Button
                  type="danger"
                  onClick={() => {
                    this.handleConfirmSelected(false);
                  }}
                >
                  不通过审核
                </Button>
              </Col>
            </Row>
            <Checkbox.Group style={{ width: '100%' }} value={selected} onChange={this.handleSelect}>
              <List
                size="large"
                rowKey="id"
                loading={loading}
                pagination={{
                  onChange: page => {
                    dispatch({
                      type: 'task/fetch',
                      payload: {
                        ...token,
                        pageSize: 10,
                        pageIndex: page - 1,
                        status: 1,
                        shop_status: 5,
                      },
                    });
                    localStorage.setItem('page-task3', page.toString());
                  },
                  current: +localStorage.getItem('page-task3') || 1,
                  pageSize: 10,
                  total,
                  showQuickJumper: true,
                }}
                dataSource={list}
                renderItem={item => (
                  <Row type="flex" justify="start" align="middle">
                    <Col span={1}>
                      <Checkbox value={item.id} />
                    </Col>
                    <Col span={23}>
                      <List.Item actions={[<Link to={`/task/detail/?id=${item.id}`}>审核</Link>]}>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              src={
                                item.user.avatar
                                  ? item.user.avatar
                                  : 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png'
                              }
                              shape="square"
                              size="large"
                            />
                          }
                          title={
                            <Link to={`/task/detail/?id=${item.id}`}>
                              {item.user.name} 的每月任务
                            </Link>
                          }
                          description={`联系方式：${item.user.phone ? item.user.phone : '暂无'}`}
                        />
                        <ListContent data={item} />
                      </List.Item>
                    </Col>
                  </Row>
                )}
              />
            </Checkbox.Group>
          </Card>
        </div>
        <Modal
          title={done ? null : `任务${current ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default TaskList;
