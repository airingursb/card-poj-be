import React, { PureComponent } from 'react';
import numeral from 'numeral';
import { connect } from 'dva';
import { Row, Col, Form, Card, Select, Avatar, List, Input, Icon, Button, Modal } from 'antd';
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

  handleRest = () => {
    const { dispatch } = this.props;
    const { token } = this.state;
    Modal.confirm({
      title: '清理卡券',
      content: `确认清理所有用户卡券？`,
      cancelText: '取消',
      okText: '确认',
      okType: 'danger',
      onOk: () => {
        dispatch({
          type: 'list/reset',
          payload: {
            ...token,
          },
        });
      },
    });
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
        value: 2,
      },
      {
        key: 'silver',
        name: '银牌合作伙伴',
        value: 3,
      },
      {
        key: 'golden',
        name: '金牌合作伙伴',
        value: 4,
      },
      {
        key: 'partner',
        name: '战略联盟合作伙伴',
        value: 5,
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

    const { status } = this.state;
    return (
      <PageHeaderWrapper title="搜索列表" content={mainSearch} onTabChange={this.handleTabChange}>
        <div className={styles.filterCardList}>
          <Card bordered={false}>
            <Form layout="inline">
              <StandardFormRow title="筛选" grid last>
                <Row gutter={16}>
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
                  <Col lg={8} md={10} sm={10} xs={24}>
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
                  <Col lg={8} md={10} sm={10} xs={24}>
                    <FormItem {...formItemLayout}>
                      <Button type="danger" onClick={this.handleRest}>
                        清理卡券
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
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default FilterCardList;
