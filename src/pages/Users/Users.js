import React, { PureComponent } from 'react';
import numeral from 'numeral';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Card,
  Select,
  Avatar,
  List,
  Input,
  Icon,
  Button,
  Modal,
  message,
} from 'antd';
import StandardFormRow from '@/components/StandardFormRow';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Link from 'umi/link';
import { CSVLink } from 'react-csv';

import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';

import styles from './Users.less';

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
  codeLoading: loading.effects['users/code'],
}))
@Form.create({
  onValuesChange({ dispatch }, changedValues, allValues) {
    // 表单项变化时请求数据
    // eslint-disable-next-line
    console.log(changedValues, allValues);
    const token = JSON.parse(localStorage.getItem('card-poj-token'));
    localStorage.setItem('user-status', changedValues.status.toString());
    // 模拟查询表单生效
    dispatch({
      type: 'list/users',
      payload: {
        ...token,
        status: changedValues.status,
        pageIndex: +localStorage.getItem('page-user'),
        pageSize: 52,
      },
    });
  },
})
class FilterCardList extends PureComponent {
  state = {
    token: JSON.parse(localStorage.getItem('card-poj-token')),
    csvData: [
      { firstname: 'Ahmed', lastname: 'Tomi', email: 'ah@smthing.co.com' },
      { firstname: 'Raed', lastname: 'Labes', email: 'rl@smthing.co.com' },
    ],
    showExport: false,
    total: 500,
    status: localStorage.getItem('user-status') || -1,
    second: '',
    code: '',
    phone: '',
    ts: '',
    delConfirm: false,
    resetConfirm: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { token, status } = this.state;
    dispatch({
      type: 'list/users',
      payload: {
        ...token,
        pageIndex: 0,
        pageSize: 52,
        status: -1,
      },
    });

    axios({
      method: 'get',
      url: 'https://api.totolelanzhou.com/admin/users_count',
      params: { ...token, status },
      adapter: jsonpAdapter,
    }).then(res => {
      this.setState({
        total: res.data.data,
      });
    });
  }

  handleExport = () => {
    const { token } = this.state;
    setTimeout(() => {}, 0);

    axios({
      method: 'get',
      url: 'https://api.totolelanzhou.com/admin/export_users',
      params: { ...token },
      adapter: jsonpAdapter,
    }).then(res => {
      this.setState({
        csvData: res.data.data,
        showExport: true,
      });
    });
  };

  handleFormSubmit = value => {
    const { dispatch } = this.props;
    const { token } = this.state;
    dispatch({
      type: 'list/find',
      payload: {
        ...token,
        phone: value,
      },
    });
  };

  handleClick = (status, name) => {
    const { dispatch } = this.props;
    const { token } = this.state;
    Modal.confirm({
      title: '发放卡券',
      content: `确认为${name}客户发放卡券？`,
      cancelText: '取消',
      okText: '确认',
      onOk: () => {
        dispatch({
          type: 'list/send',
          payload: {
            ...token,
            shop_status: status,
          },
        });
      },
    });
  };

  handleRest = async () => {
    const { dispatch } = this.props;
    const { token, phone, code, ts } = this.state;

    if (!phone || !code || !ts) {
      message.error('请填写管理员手机号码和验证码');
      return;
    }

    await dispatch({
      type: 'list/reset',
      payload: {
        ...token,
        phone,
        code,
        ts,
      },
    });
  };

  handleDel = async () => {
    const { dispatch } = this.props;
    const { token, phone, code, ts } = this.state;

    if (!phone || !code || !ts) {
      message.error('请填写管理员手机号码和验证码');
      return;
    }

    const delRes = await dispatch({
      type: 'users/delAll',
      payload: {
        phone,
        code,
        ts,
        ...token,
      },
    });

    if (!delRes) return;

    await dispatch({
      type: 'list/users',
      payload: {
        ...token,
        pageIndex: 0,
        pageSize: 52,
        status: -1,
      },
    });
  };

  getConfirmCode = async () => {
    let { second } = this.state;
    const { phone } = this.state;
    if (second || !phone) return;

    const { token } = this.state;
    const { dispatch } = this.props;

    const codeRes = await dispatch({
      type: 'users/code',
      payload: {
        account: phone,
        ...token,
      },
    });

    if (!codeRes) return;

    this.setState({
      ts: codeRes.data.ts,
    });

    second = 60;
    this.setState({
      second,
    });
    const secondInterval = setInterval(() => {
      second -= 1;

      if (second === -1) {
        clearInterval(secondInterval);
        second = '';
      }

      this.setState({
        second,
      });
    }, 1000);
  };

  render() {
    const {
      list: { list },
      loading,
      form,
      dispatch,
    } = this.props;
    const { getFieldDecorator } = form;

    const { csvData, showExport, total, token } = this.state;

    const CardInfo = ({ phone, status }) => {
      let mode = '';
      switch (+status) {
        case 0:
          mode = <span style={{ color: '#8c8c8c' }}>未审核</span>;
          break;
        case 100:
          mode = (
            <span style={{ color: '#096dd9' }}>
              审核中 <Icon type="exclamation-circle" theme="outlined" />
            </span>
          );
          break;
        case 201:
          mode = (
            <span style={{ color: '#52c41a' }}>
              认证店主 <Icon type="check-circle" theme="outlined" />
            </span>
          );
          break;
        case 202:
          mode = (
            <span style={{ color: '#08979c' }}>
              认证游客 <Icon type="check-circle" theme="outlined" />
            </span>
          );
          break;
        case 400:
          mode = (
            <span style={{ color: '#cf1322' }}>
              审核不通过 <Icon type="close-circle" theme="outlined" />
            </span>
          );
          break;
        default:
          break;
      }

      return (
        <div className={styles.cardInfo}>
          <div>
            <p>联系方式 {typeof phone !== 'string' ? '暂无' : phone}</p>
          </div>
          <div>
            <p>认证类型 {mode}</p>
          </div>
        </div>
      );
    };

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <Input.Search
          placeholder="请输入手机号"
          enterButton="搜索"
          size="large"
          onSearch={this.handleFormSubmit}
          style={{ width: 522 }}
        />
      </div>
    );

    const headers = [
      { label: 'id', key: 'id' },
      { label: '姓名', key: 'name' },
      { label: '身份', key: 'status' },
      { label: '店铺名', key: 'shop_name' },
      { label: '店铺类别', key: 'shop_status' },
      { label: '店铺地址', key: 'shop_address' },
      { label: '联系方式', key: 'phone' },
      { label: '卡券数目', key: 'card_num' },
      { label: '是否领取卡券', key: 'is_obtain' },
      { label: '本月完成任务', key: 'task_times' },
    ];

    const confirmBtn = [
      {
        key: 'normal',
        name: '标准网点',
        value: 1,
      },
      {
        key: 'yello',
        name: '黄色风暴',
        value: 0,
      },
      {
        key: 'thousand',
        name: '万元户黄色风暴网店',
        value: 3,
      },
      {
        key: 'silver',
        name: '银牌合作伙伴',
        value: 4,
      },
      {
        key: 'golden',
        name: '金牌合作伙伴',
        value: 5,
      },
      {
        key: 'partner',
        name: '战略联盟合作伙伴',
        value: 6,
      },
    ].map(val => (
      <Col key={val.key}>
        <FormItem {...formItemLayout}>
          <Button
            type="primary"
            onClick={() => {
              this.handleClick(val.value, val.name);
            }}
          >
            {val.name}
          </Button>
        </FormItem>
      </Col>
    ));

    const { status, second, delConfirm, resetConfirm, code, phone } = this.state;
    const { codeLoading } = this.props;
    return (
      <PageHeaderWrapper title="搜索列表" content={mainSearch} onTabChange={this.handleTabChange}>
        <div className={styles.filterCardList}>
          <Card bordered={false}>
            <Form layout="inline">
              <StandardFormRow title="筛选" grid last>
                <Row gutter={5} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Col lg={8} md={10} sm={10} xs={24}>
                    <FormItem {...formItemLayout} label="用户类型">
                      {getFieldDecorator('status', {})(
                        <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                          <Option value="-1">不限</Option>
                          <Option value="0">未审核</Option>
                          <Option value="100">审核中</Option>
                          <Option value="201">认证店主</Option>
                          <Option value="202">认证游客</Option>
                          <Option value="400">审核不通过</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col>
                    <FormItem {...formItemLayout}>
                      <Button type="primary" onClick={this.handleExport}>
                        {showExport ? (
                          <CSVLink
                            data={csvData}
                            headers={headers}
                            filename={'用户信息.csv'} // eslint-disable-line
                          >
                            确定
                          </CSVLink>
                        ) : (
                          '导出成 Excel'
                        )}
                      </Button>
                    </FormItem>
                  </Col>
                  <Col>
                    <FormItem {...formItemLayout}>
                      <Button
                        type="danger"
                        onClick={() => {
                          this.setState({
                            resetConfirm: true,
                          });
                        }}
                      >
                        清理卡券
                      </Button>
                    </FormItem>
                  </Col>
                  <Col>
                    <FormItem {...formItemLayout}>
                      <Button
                        type="danger"
                        onClick={() => {
                          this.setState({
                            delConfirm: true,
                          });
                        }}
                      >
                        删除僵尸用户
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </StandardFormRow>
              <StandardFormRow title="发放卡券" grid last style={{ marginTop: 20 }}>
                <Row gutter={5} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {confirmBtn}
                </Row>
              </StandardFormRow>
            </Form>
          </Card>
          <List
            rowKey="id"
            style={{ marginTop: 24 }}
            grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
            loading={loading}
            dataSource={list}
            pagination={{
              onChange: page => {
                dispatch({
                  type: 'list/users',
                  payload: {
                    ...token,
                    pageSize: 52,
                    pageIndex: page,
                    status,
                  },
                });
                localStorage.setItem('page-user', page.toString());
              },
              current: +localStorage.getItem('page-user'),
              pageSize: 52,
              total,
              showQuickJumper: true,
            }}
            renderItem={item => (
              <Link to={`/users/profile?id=${item.id}`}>
                <List.Item key={item.id}>
                  <Card hoverable bodyStyle={{ paddingBottom: 20 }}>
                    <Card.Meta
                      avatar={<Avatar size="small" src={item.avatar} />}
                      title={item.name}
                    />
                    <div className={styles.cardItemContent}>
                      <CardInfo phone={item.phone} status={numeral(item.status).format('0,0')} />
                    </div>
                  </Card>
                </List.Item>
              </Link>
            )}
          />
          <Modal
            title={delConfirm ? '确认删除僵尸用户' : '确认清理卡券'}
            cancelText="取消"
            okText="确认"
            okType="danger"
            visible={delConfirm || resetConfirm}
            onCancel={() => {
              this.setState({
                resetConfirm: false,
                delConfirm: false,
              });
            }}
            onOk={() => {
              // eslint-disable-next-line no-unused-expressions
              delConfirm && !resetConfirm && this.handleDel();
              // eslint-disable-next-line no-unused-expressions
              resetConfirm && !delConfirm && this.handleRest();
            }}
          >
            <Row align="middle" gutter={[8, 16]} justify="space-between">
              <Col span={24}>
                <Input
                  placeholder="输入手机号码"
                  value={phone}
                  onChange={e => {
                    this.setState({
                      phone: e.target.value,
                    });
                  }}
                />
              </Col>
            </Row>
            <Row align="middle" gutter={[8, 16]} justify="space-between">
              <Col span={18}>
                <Input
                  placeholder="输入验证码"
                  value={code}
                  onChange={e => {
                    this.setState({
                      code: e.target.value,
                    });
                  }}
                />
              </Col>
              <Col span={6}>
                <Button
                  type="primary"
                  disabled={second !== ''}
                  loading={codeLoading}
                  onClick={this.getConfirmCode}
                >
                  {second ? `${second}S` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </Modal>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default FilterCardList;
