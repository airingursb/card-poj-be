import React, { PureComponent } from 'react';
import numeral from 'numeral';
import { connect } from 'dva';
import { Row, Col, Form, Card, Select, Avatar, List, Input, Icon, Button } from 'antd';
import StandardFormRow from '@/components/StandardFormRow';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Link from 'umi/link';

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
    // 模拟查询表单生效
    dispatch({
      type: 'list/filter',
      payload: {
        ...token,
        status: changedValues.status,
      },
    });
  },
})
class FilterCardList extends PureComponent {
  state = {
    token: JSON.parse(localStorage.getItem('card-poj-token')),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { token } = this.state;
    dispatch({
      type: 'list/users',
      payload: {
        ...token,
      },
    });
  }

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

  handleClick = () => {
    const { dispatch } = this.props;
    const { token } = this.state;
    dispatch({
      type: 'list/send',
      payload: {
        ...token,
      },
    });
  };

  render() {
    const {
      list: { list },
      loading,
      form,
    } = this.props;
    const { getFieldDecorator } = form;

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
                      <Button type="primary" onClick={this.handleClick}>
                        自动发放卡券
                      </Button>
                    </FormItem>
                  </Col>
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
