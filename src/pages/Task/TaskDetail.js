import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import { Button, Form, Radio, Icon, Row, Col, Card, Divider, Badge, Select } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';

import styles from './TaskDetail.less';

const { Description } = DescriptionList;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

@connect(({ task, loading }) => ({
  task,
  loading: loading.effects['task/detail'],
  submitting: loading.effects['task/submit'],
}))
@Form.create()
class TaskDetail extends Component {
  state = {
    stepDirection: 'horizontal',
    token: JSON.parse(localStorage.getItem('card-poj-token')),
    status: '',
    refuseInfo: '1',
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { token } = this.state;

    dispatch({
      type: 'task/detail',
      payload: {
        ...token,
        task_id: location.query.id,
      },
    });

    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

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

  handleSubmit = () => {
    const { dispatch, location } = this.props;
    const { token, status, refuseInfo } = this.state;
    dispatch({
      type: 'task/submit',
      payload: {
        ...token,
        task_id: location.query.id,
        status,
        refuse_info: refuseInfo,
      },
    });
  };

  handleChange = e => {
    const {
      target: { value },
    } = e;
    this.setState({ status: value });
  };

  handleSelect = e => {
    this.setState({ refuseInfo: e });
  };

  render() {
    const {
      task: { data },
      submitting,
    } = this.props;

    const { status, refuseInfo } = this.state;

    const action = (
      <Form>
        {status === '3' && (
          <span style={{ marginRight: 10 }}>
            拒绝原因：
            <Select value={refuseInfo} style={{ width: 120 }} onChange={this.handleSelect}>
              <Select.Option value="陈列排面数不合格">陈列排面数不合格</Select.Option>
              <Select.Option value="陈列品项数量不合格">陈列品项数量不合格</Select.Option>
              <Select.Option value="照片拍摄不清楚">照片拍摄不清楚</Select.Option>
              <Select.Option value="必备陈列品项不合格">必备陈列品项不合格</Select.Option>
              <Select.Option value="缺少广宣物料">缺少广宣物料</Select.Option>
            </Select>
          </span>
        )}
        <Radio.Group value={status} buttonStyle="solid" onChange={this.handleChange}>
          <Radio.Button value="3">驳回</Radio.Button>
          <Radio.Button value="2">通过</Radio.Button>
        </Radio.Group>
        <Divider type="vertical" style={{ margin: '0 16px' }} />
        <Button type="primary" loading={submitting} onClick={this.handleSubmit}>
          提交
        </Button>
      </Form>
    );

    let statusText = '';
    let statusShow = '';
    let shopStatus = '未登记';

    switch (data && data.user && +data.user.shop_status) {
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
        break;
    }

    switch (data && data.user && +data.user.status) {
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

    switch (data && +data.status) {
      case 0:
        statusShow = <Badge status="default" text="未领取" />;
        break;
      case 1:
        statusShow = <Badge status="processing" text="审核中" />;
        break;
      case 2:
        statusShow = <Badge status="success" text="已完成" />;
        break;
      case 3:
        statusShow = <Badge status="error" text="驳回" />;
        break;
      case 4:
        statusShow = <Badge status="error" text="已过期" />;
        break;
      default:
        break;
    }

    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{statusShow}</div>
        </Col>
      </Row>
    );

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="执行人">
          <a href={`/users/profile?id=${data && data.user && data.user.id}`}>
            {data && data.user && data.user.name}
          </a>
        </Description>
        <Description term="用户身份">{statusText}</Description>
        <Description term="联系方式">{data && data.user && data.user.phone}</Description>
        <Description term="提交时间">
          {data && data.finish_time && moment(new Date(data.finish_time)).format('YYYY-MM-DD')}
        </Description>
        <Description term="开始时间">
          {data && data.begin_time && moment(new Date(data.begin_time)).format('YYYY-MM-DD')}
        </Description>
        <Description term="截止时间">
          {data && data.end_time && moment(new Date(data.end_time)).format('YYYY-MM-DD')}
        </Description>
      </DescriptionList>
    );

    return (
      <PageHeaderWrapper
        title={`任务详情 - ID: ${data && data.id}`}
        logo={
          <img
            alt=""
            src={
              (data && data.user && data.user.avatar) ||
              'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png'
            }
          />
        }
        action={action}
        content={description}
        extraContent={extra}
      >
        <Card title="店铺信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="用户姓名">{data && data.user && data.user.name}</Description>
            <Description term="店铺名">{data && data.user && data.user.shop_name}</Description>
            <Description term="店铺类别">{shopStatus}</Description>
            <Description term="联系方式">{data && data.user && data.user.phone}</Description>
            <Description term="店铺地址">{data && data.user && data.user.shop_address}</Description>
          </DescriptionList>
          <Divider style={{ margin: '16px 0' }} />
          <Description term="营业执照">
            {(data &&
              data.user &&
              data.user.shop_pic && (
                <img
                  style={{ height: '200px' }}
                  alt=""
                  src={
                    (data && data.user && data.user.shop_pic) ||
                    'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png'
                  }
                />
              )) ||
              '未登记'}
          </Description>
        </Card>
        <Card title="任务信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }} title="商品任务">
            <Description term="门头图">
              <img
                style={{ height: '200px' }}
                alt=""
                src={
                  (data && data.pic_shop) ||
                  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png'
                }
              />
            </Description>
            <Description term="远景图">
              <img
                style={{ height: '200px' }}
                alt=""
                src={
                  (data && data.pic_long) ||
                  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png'
                }
              />
            </Description>
          </DescriptionList>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="近景图">
              <img
                style={{ height: '200px' }}
                alt=""
                src={
                  (data && data.pic_short_2) ||
                  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png'
                }
              />
            </Description>
            <Description>
              <img
                style={{ height: '200px' }}
                alt=""
                src={
                  (data && data.pic_short_2) ||
                  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png'
                }
              />
            </Description>
            <Description>
              <img
                style={{ height: '200px' }}
                alt=""
                src={
                  (data && data.pic_short_3) ||
                  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png'
                }
              />
            </Description>
          </DescriptionList>
          <DescriptionList style={{ marginBottom: 24 }} title="销售任务">
            <Description term="销售品项">{data && data.sell_class}</Description>
            <Description term="销售金额">{data && data.sell_price}</Description>
            <Description term="销售数目">{data && data.sell_number}</Description>
            <Description term="销售台账">
              <img
                style={{ height: '200px' }}
                alt=""
                src={
                  (data && data.pic_books) ||
                  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png'
                }
              />
            </Description>
          </DescriptionList>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TaskDetail;
