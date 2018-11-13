import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import { Button, Form, Radio, Icon, Row, Col, Card, Divider, Badge } from 'antd';
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

  handleSubmit = e => {
    const { dispatch, form, location } = this.props;
    const { token } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'task/submit',
          payload: {
            ...token,
            task_id: location.query.id,
            status: values.status,
          },
        });
      }
    });
  };

  render() {
    const {
      task: { data },
      form: { getFieldDecorator },
      submitting,
    } = this.props;

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
          <Radio.Group initialValue={data && data.status} buttonStyle="solid">
            <Radio.Button value="3">驳回</Radio.Button>
            <Radio.Button value="2">通过</Radio.Button>
          </Radio.Group>
        )}
        <Divider type="vertical" style={{ margin: '0 16px' }} />
        <Button type="primary" htmlType="submit" loading={submitting}>
          提交
        </Button>
      </Form>
    );

    let statusText = '';
    let statusShow = '';

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
            <Description term="店铺类别">{data && data.user && data.user.shop_stauts}</Description>
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
            <Description term="近景图">
              <img
                style={{ height: '200px' }}
                alt=""
                src={
                  (data && data.pic_short) ||
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