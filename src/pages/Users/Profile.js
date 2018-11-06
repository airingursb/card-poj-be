import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import { Button, Radio, Row, Col, Card, Badge, Table, Tag, Form, Divider, Icon } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';

import styles from './Profile.less';

const { Description } = DescriptionList;

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
  };

  componentDidMount() {
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

  render() {
    const { operationkey } = this.state;
    const { loading, users } = this.props;
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    let statusText = '待审批';

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
          <Radio.Group defaultValue={users.status} buttonStyle="solid">
            <Radio.Button value="400">驳回</Radio.Button>
            <Radio.Button value="201">店主</Radio.Button>
            <Radio.Button value="202">游客</Radio.Button>
          </Radio.Group>
        )}
        <Divider type="vertical" style={{ margin: '0 16px' }} />
        <Button type="primary" htmlType="submit" loading={submitting}>
          提交
        </Button>
      </Form>
    );

    switch (+users.status) {
      case 0:
        statusText = <span>未认证</span>;
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

    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{statusText}</div>
        </Col>
      </Row>
    );

    const columns = [
      {
        title: '任务 ID',
        dataIndex: 'id',
        key: 'id',
        render: id => <a href={`http://localhost:8000/users/profile?id=${users.id}`}>{id}</a>,
      },
      {
        title: '执行人',
        dataIndex: 'name',
        key: 'name',
        render: () => (
          <Tag color="blue" key={Math.random}>
            <a href={`http://localhost:8000/users/profile?id=${users.id}`}>{users.name}</a>
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
              dom = <Badge status="default" text="未开始" />;
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
        render: ts => <span>{moment(new Date(ts)).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '结束时间',
        dataIndex: 'end_time',
        key: 'end_time',
        render: ts => <span>{moment(new Date(ts)).format('YYYY-MM-DD')}</span>,
      },
    ];

    const contentList = {
      tab1: (
        <Table pagination={false} loading={loading} dataSource={users.tasks} columns={columns} />
      ),
    };

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="联系方式">{users.phone}</Description>
        <Description term="认证类型">XX 服务</Description>
        <Description term="创建时间">{users.created_at}</Description>
        <Description term="用户 id">
          <a href="">{users.id}</a>
        </Description>
        <Description term="更新日期">{users.updated_at}</Description>
        <Description term="微信 id">{users.openid}</Description>
      </DescriptionList>
    );

    return (
      <PageHeaderWrapper
        title={users.name}
        logo={
          <img
            alt=""
            src={
              users.avatar
                ? users.avatar
                : 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png'
            }
          />
        }
        action={action}
        content={description}
        extraContent={extra}
      >
        <Card title="店铺信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="用户姓名">{users.name}</Description>
            <Description term="店铺名">{users.shop_name}</Description>
            <Description term="店铺类别">{users.shop_stauts}</Description>
            <Description term="联系方式">{users.phone}</Description>
            <Description term="店铺地址">{users.shop_address}</Description>
          </DescriptionList>
        </Card>
        <Card title="任务列表" style={{ marginBottom: 24 }} bordered={false}>
          {contentList[operationkey]}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AdvancedProfile;
