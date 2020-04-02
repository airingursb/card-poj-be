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

  handleCard400 = val => {
    this.handleFormSubmit(val, 3);
  };

  handleCard600 = val => {
    this.handleFormSubmit(val, 4);
  };

  handleCard1000 = val => {
    this.handleFormSubmit(val, 5);
  };

  handleCard1200 = val => {
    this.handleFormSubmit(val, 6);
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
      ticket: {
        card_50: card50,
        card_200: card200,
        card_400: card400,
        card_600: card600,
        card_1000: card1000,
        card_1200: card1200,
      },
    } = this.props;

    return (
      <PageHeaderWrapper>
        <Row type="flex" align="middle" className={styles.row}>
          <Col span={4} className={styles.title}>
            标准网点
          </Col>
          <Col span={9}>
            <div>当前卡券： {card50 ? card50.card_id : ''} </div>
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
          <Col span={4} className={styles.title}>
            黄色风暴网点
          </Col>
          <Col span={9}>
            <div>当前卡券： {card200 ? card200.card_id : ''} </div>
            <div>
              <Input.Search
                placeholder="请输入卡劵ID"
                enterButton="确定"
                onSearch={this.handleCard200}
              />
            </div>
          </Col>
        </Row>
        <Row type="flex" align="middle" className={styles.row}>
          <Col span={4} className={styles.title}>
            万元户黄色风暴网点
          </Col>
          <Col span={9}>
            <div>当前卡券： {card400 ? card400.card_id : ''} </div>
            <div>
              <Input.Search
                placeholder="请输入卡劵ID"
                enterButton="确定"
                onSearch={this.handleCard400}
              />
            </div>
          </Col>
        </Row>
        <Row type="flex" align="middle" className={styles.row}>
          <Col span={4} className={styles.title}>
            银牌合作伙伴
          </Col>
          <Col span={9}>
            <div>当前卡券： {card600 ? card600.card_id : ''} </div>
            <div>
              <Input.Search
                placeholder="请输入卡劵ID"
                enterButton="确定"
                onSearch={this.handleCard600}
              />
            </div>
          </Col>
        </Row>
        <Row type="flex" align="middle" className={styles.row}>
          <Col span={4} className={styles.title}>
            金牌合作伙伴
          </Col>
          <Col span={9}>
            <div>当前卡券： {card1000 ? card1000.card_id : ''} </div>
            <div>
              <Input.Search
                placeholder="请输入卡劵ID"
                enterButton="确定"
                onSearch={this.handleCard1000}
              />
            </div>
          </Col>
        </Row>
        <Row type="flex" align="middle" className={styles.row}>
          <Col span={4} className={styles.title}>
            战略联盟合作伙伴
          </Col>
          <Col span={9}>
            <div>当前卡券： {card1200 ? card1200.card_id : ''} </div>
            <div>
              <Input.Search
                placeholder="请输入卡劵ID"
                enterButton="确定"
                onSearch={this.handleCard1200}
              />
            </div>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default FilterCardList;
