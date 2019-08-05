import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Input } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Card.less';

@connect(({ ticket }) => ({
  ticket,
}))
class FilterCardList extends PureComponent {
  state = {
    token: JSON.parse(localStorage.getItem('card-poj-token')),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { token } = this.state;
    dispatch({
      type: 'ticket/fetch',
      payload: {
        ...token,
      },
    });
  }

  handleCard50 = val => {
    this.handleFormSubmit(val, 2);
  };

  handleCard200 = val => {
    this.handleFormSubmit(val, 1);
  };

  handleFormSubmit = (cardId, status) => {
    const { dispatch } = this.props;
    const { token } = this.state;
    dispatch({
      type: 'ticket/update',
      payload: {
        ...token,
        card_id: cardId,
        status,
      },
    });
  };

  render() {
    const {
      ticket: { card_50: card50, card_200: card200 },
    } = this.props;

    return (
      <PageHeaderWrapper>
        <Row type="flex" align="middle" className={styles.row}>
          <Col span={3} className={styles.title}>
            标准
          </Col>
          <Col span={10}>
            <div>
              当前卡券：
              {card50 ? card50.card_id : ''}
            </div>
            <div>
              <Input.Search
                placeholder="请输入卡劵ID"
                enterButton="确定"
                onSearch={this.handleCard50}
              />
            </div>
          </Col>
        </Row>
        <Row type="flex" align="middle" className={styles.row}>
          <Col span={3} className={styles.title}>
            黄色风暴
          </Col>
          <Col span={10}>
            <div>
              当前卡券：
              {card200 ? card200.card_id : ''}
            </div>
            <div>
              <Input.Search
                placeholder="请输入卡劵ID"
                enterButton="确定"
                onSearch={this.handleCard200}
              />
            </div>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default FilterCardList;
