import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import {
  Button,
  Radio,
  Row,
  Col,
  Card,
  Badge,
  Table,
  Tag,
  Form,
  Divider,
  Icon,
  Select,
  Switch,
  Modal,
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import Link from 'umi/link';

import styles from './Profile.less';

const { Description } = DescriptionList;

const { Option } = Select;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

@connect(({ users, loading }) => ({
  users,
  loading: loading.effects['users/fetch'],
  submitting: loading.effects['users/submit'],
}))
@Form.create()
class AdvancedProfile extends Component {
  state = {
    operationkey: 'tab1',
    stepDirection: 'horizontal',
    token: JSON.parse(localStorage.getItem('card-poj-token')),
    shopStatus: '',
    statusText: '待审批',
    cardStatus: '未领取',
  };

  componentWillMount() {
    const { dispatch, location } = this.props;
    const { token } = this.state;
    dispatch({
      type: 'users/fetch',
      payload: {
        ...token,
        user_id: location.query.id,
      },
    });
    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  handleShopStatus = status => {
    const { dispatch, location, users } = this.props;
    const { token } = this.state;

    if (users.shop_status === Number(status)) return;
    dispatch({
      type: 'users/modify',
      payload: {
        ...token,
        user_id: location.query.id,
        shop_status: Number(status),
      },
    });
  };

  handleSubmit = e => {
    const { dispatch, form, location } = this.props;
    const { token } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'users/submit',
          payload: {
            ...token,
            user_id: location.query.id,
            status: values.status,
          },
        });
      }
    });
  };

  handleFulfil = fulfil => {
    const { dispatch, users, location } = this.props;
    const { token } = this.state;

    if (fulfil === !!users.is_fulfil) return;

    dispatch({
      type: 'users/fulfil',
      payload: {
        ...token,
        user_id: location.query.id,
        is_fulfil: fulfil,
      },
    });
  };

  handleDel = () => {
    const { dispatch, location, history } = this.props;
    const { token } = this.state;

    Modal.confirm({
      title: '删除该用户',
      content: `确认该用户？`,
      cancelText: '取消',
      okText: '确认',
      okType: 'danger',
      onOk: async () => {
        await dispatch({
          type: 'users/delUser',
          payload: {
            ...token,
            user_id: location.query.id,
          },
        });

        setTimeout(() => {
          history.push('/users/list');
        }, 1000);
      },
    });
  };

  render() {
    const { operationkey } = this.state;
    let { statusText, shopStatus, cardStatus } = this.state;
    const { loading, users } = this.props;
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    if (+users.task_times > 10) {
      cardStatus = '可领取';
      if (+users.card_num === 1) cardStatus = '可领取';
      if (+users.is_obtain === 1) cardStatus = '已领取';
    } else {
      cardStatus = '没有资格领取';
    }

    switch (+users.shop_status) {
      case 0:
        shopStatus = '黄色风暴网点';
        break;
      case 1:
        shopStatus = '标准门店';
        break;
      case 3:
        shopStatus = '万元户黄色风暴网点';
        break;
      case 4:
        shopStatus = '银牌合作伙伴';
        break;
      case 5:
        shopStatus = '金牌合作伙伴';
        break;
      case 6:
        shopStatus = '战略联盟合作伙伴';
        break;
      default:
        shopStatus = '未登记';
        break;
    }

    switch (+users.status) {
      case 0:
        statusText = <span> 未认证 </span>;
        break;
      case 100:
        statusText = (
          <span style={{ color: '#096dd9' }}>
            <Icon type="exclamation-circle" theme="outlined" /> 待审核
          </span>
        );
        break;
      case 201:
        statusText = (
          <span style={{ color: '#52c41a' }}>
            <Icon type="check-circle" theme="outlined" /> 认证店主
          </span>
        );
        break;
      case 202:
        statusText = (
          <span style={{ color: '#08979c' }}>
            <Icon type="check-circle" theme="outlined" /> 认证游客
          </span>
        );
        break;
      case 400:
        statusText = (
          <span style={{ color: 'red' }}>
            <Icon type="close-circle" theme="outlined" /> 审核驳回
          </span>
        );
        break;
      default:
        break;
    }

    const action = (
      <Form onSubmit={this.handleSubmit}>
        {getFieldDecorator('status', {
          rules: [
            {
              required: true,
              message: '您必须要选择一个审核结果',
            },
          ],
        })(
          <Radio.Group initialValue={users && users.status} buttonStyle="solid">
            <Radio.Button value="400"> 驳回 </Radio.Button>
            <Radio.Button value="201"> 店主 </Radio.Button>
            <Radio.Button value="202"> 游客 </Radio.Button>
          </Radio.Group>
        )}
        <Divider type="vertical" style={{ margin: '0 16px' }} />
        <Button type="primary" htmlType="submit" loading={submitting}>
          提交
        </Button>
      </Form>
    );
    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}> 状态 </div>
          <div className={styles.heading}> {statusText} </div>
        </Col>
      </Row>
    );

    const columns = [
      {
        title: '任务 ID',
        dataIndex: 'id',
        key: 'id',
        render: id => <Link to={`/task/detail?id=${id}`}> {id} </Link>,
      },
      {
        title: '执行人',
        dataIndex: 'name',
        key: 'name',
        render: () => (
          <Tag color="blue" key={Math.random}>
            <a href={`/users/profile?id=${users.id}`}> {users.name} </a>
          </Tag>
        ),
      },
      {
        title: '任务结果',
        dataIndex: 'status',
        key: 'status',
        render: status => {
          let dom = '';
          switch (+status) {
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
              dom = <Badge status="error" text="驳回" />;
              break;
            case 4:
              dom = <Badge status="error" text="已过期" />;
              break;
            default:
              break;
          }
          return dom;
        },
      },
      {
        title: '开始时间',
        dataIndex: 'begin_time',
        key: 'begin_time',
        render: ts => <span> {moment(new Date(ts)).format('YYYY-MM-DD')} </span>,
      },
      {
        title: '结束时间',
        dataIndex: 'end_time',
        key: 'end_time',
        render: ts => <span> {moment(new Date(ts)).format('YYYY-MM-DD')} </span>,
      },
    ];

    const contentList = {
      tab1: (
        <Table pagination={false} loading={loading} dataSource={users.tasks} columns={columns} />
      ),
    };

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="联系方式"> {users.phone} </Description>
        <Description term="门店类型">
          <Select style={{ width: 180 }} value={shopStatus} onChange={this.handleShopStatus}>
            <Option value="1"> 标准网点 </Option>
            <Option value="0"> 黄色风暴网点 </Option>
            <Option value="3"> 万元户黄色风暴网点 </Option>
            <Option value="4"> 银牌合作伙伴 </Option>
            <Option value="5"> 金牌合作伙伴 </Option>
            <Option value="6"> 战略联盟合作伙伴 </Option>
          </Select>
        </Description>
        <Description term="创建时间">
          {users.created_at && users.created_at.replace('T', ' ').replace('.000Z', '')}
        </Description>
        <Description term="用户 id">
          <a href=""> {users.id} </a>
        </Description>
        <Description term="更新日期">
          {users.updated_at && users.updated_at.replace('T', ' ').replace('.000Z', '')}
        </Description>
        <Description term="本月卡券"> {cardStatus} </Description>
        <Description term="回款状态">
          <Switch
            checkedChildren="已回款"
            unCheckedChildren="未回款"
            checked={!!users.is_fulfil}
            onChange={this.handleFulfil}
          />
        </Description>
        <Description>
          <Button type="danger" onClick={this.handleDel}>
            删除用户
          </Button>
        </Description>
      </DescriptionList>
    );

    return (
      <PageHeaderWrapper
        title={users.name}
        logo={
          <img
            alt=""
            src={
              users.avatar || 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png'
            }
          />
        }
        action={action}
        content={description}
        extraContent={extra}
      >
        <Card title="店铺信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="用户姓名"> {users.name} </Description>
            <Description term="店铺名"> {users.shop_name} </Description>
            <Description term="店铺类别"> {shopStatus} </Description>
            <Description term="联系方式"> {users.phone} </Description>
            <Description term="店铺地址"> {users.shop_address} </Description>
          </DescriptionList>
          <Divider style={{ margin: '16px 0' }} />
          <Description term="营业执照">
            {(users.shop_pic && (
              <img
                style={{ height: '200px' }}
                alt=""
                src={
                  users.shop_pic ||
                  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png'
                }
              />
            )) ||
              '未登记'}
          </Description>
        </Card>
        <Card title="任务列表" style={{ marginBottom: 24 }} bordered={false}>
          {contentList[operationkey]}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AdvancedProfile;
