import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { List, Card, Modal, Form, Button } from 'antd';

import { CSVLink } from 'react-csv';
import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './FeedbackList.less';

@connect(({ list, feedback, loading }) => ({
  list,
  feedback,
  loading: loading.models.feedback,
}))
@Form.create()
class FeedbackList extends PureComponent {
  state = {
    current: false,
    token: JSON.parse(localStorage.getItem('card-poj-token')),
    csvData: [],
    showExport: false,
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const token = JSON.parse(localStorage.getItem('card-poj-token'));
    dispatch({
      type: 'feedback/fetch',
      payload: {
        ...token,
      },
    });
  }

  showModal = () => {
    this.setState({
      current: undefined,
    });
  };

  showEditModal = item => {
    this.setState({
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
  };

  handleExport = () => {
    const { token } = this.state;
    setTimeout(() => {}, 0);
    axios({
      method: 'get',
      url: 'https://api.totolelanzhou.com/admin/export_feedbacks',
      params: { ...token },
      adapter: jsonpAdapter,
    }).then(res => {
      this.setState({
        csvData: res.data.data,
        showExport: true,
      });
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';
    const token = JSON.parse(localStorage.getItem('card-poj-token'));

    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'feedback/submit',
        payload: { id, ...token, ...fieldsValue },
      });
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    const token = JSON.parse(localStorage.getItem('card-poj-token'));
    dispatch({
      type: 'feedback/delete',
      payload: {
        ...token,
        feedback_id: id,
      },
    });
  };

  render() {
    const {
      feedback: { feedbacks },
      loading,
    } = this.props;

    const { showExport, csvData } = this.state;

    const deleteConfirm = currentItem => {
      Modal.confirm({
        title: '删除反馈',
        content: '确定删除该反馈吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => this.deleteItem(currentItem.id),
      });
    };

    const ListContent = ({ data: item }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>反馈时间</span>
          <p>{moment(item.date).format('YYYY-MM-DD HH:mm')}</p>
        </div>
      </div>
    );

    const headers = [
      { label: 'id', key: 'id' },
      { label: '姓名', key: 'user_id' },
      { label: '反馈内容', key: 'content' },
      { label: '提交时间', key: 'created_at' },
    ];

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Button type="primary" onClick={this.handleExport}>
            {showExport ? (
              <CSVLink
                data={csvData}
                headers={headers}
                filename={'反馈信息.csv'} // eslint-disable-line
              >
                确定
              </CSVLink>
            ) : (
              '导出成 Excel'
            )}
          </Button>
          <Card
            className={styles.listCard}
            bordered={false}
            title="反馈列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              dataSource={feedbacks}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      onClick={e => {
                        e.preventDefault();
                        deleteConfirm(item);
                      }}
                    >
                      删除
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    // avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    title={<a href={item.href}>{item.user.name}</a>}
                    description={item.content}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default FeedbackList;
