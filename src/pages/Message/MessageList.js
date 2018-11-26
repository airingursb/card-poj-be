import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import { List, Card, Input, Button, Modal, Form } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';

import styles from './MessageList.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ list, message, loading }) => ({
  list,
  message,
  loading: loading.models.message,
}))
@Form.create()
class MessageList extends PureComponent {
  state = { visible: false, done: false };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const token = JSON.parse(localStorage.getItem('card-poj-token'));
    dispatch({
      type: 'message/fetch',
      payload: {
        ...token,
      },
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
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
      this.setState({
        done: true,
      });
      dispatch({
        type: 'message/submit',
        payload: { id, ...token, ...fieldsValue },
      });
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    const token = JSON.parse(localStorage.getItem('card-poj-token'));
    dispatch({
      type: 'message/delete',
      payload: {
        ...token,
        message_id: id,
      },
    });
  };

  render() {
    const {
      message: { messages },
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, done, current = {} } = this.state;

    const deleteConfirm = currentItem => {
      Modal.confirm({
        title: '删除任务',
        content: '确定删除该任务吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => this.deleteItem(currentItem.id),
      });
    };

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const ListContent = ({ data: item }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>发布时间</span>
          <p>{moment(item.publish_time).format('YYYY-MM-DD HH:mm')}</p>
        </div>
      </div>
    );

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="发布成功"
            description="已成功发布通知，并向所有的认证店主群发了通知短信。"
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="标题" {...this.formLayout}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入标题' }],
              initialValue: current.title,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...this.formLayout} label="内容">
            {getFieldDecorator('content', {
              rules: [{ message: '请输入内容！', min: 1 }],
              initialValue: current.subDescription,
            })(<TextArea rows={4} placeholder="请输入内容" />)}
          </FormItem>
        </Form>
      );
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="通知列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              添加
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              dataSource={messages}
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
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.content}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          title={done ? null : `任务${current ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default MessageList;
