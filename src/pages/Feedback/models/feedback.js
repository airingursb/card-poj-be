import {
  editMessage,
  filterTasks,
  getNotice,
  deleteFeedback,
  createNotice,
  getFeedbacks,
} from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'feedback',

  state: {},

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getFeedbacks, payload);
      if (response.code === 0) {
        yield put({
          type: 'show',
          payload: response.data,
        });
      }
    },
    *filter({ payload }, { call, put }) {
      const response = yield call(filterTasks, payload);
      if (response.code === 0) {
        yield put({
          type: 'show',
          payload: response.data,
        });
      }
    },
    *create({ payload }, { call }) {
      yield call(createNotice, payload);
    },
    *list({ payload }, { call, put }) {
      const response = yield call(getNotice, payload);
      if (response.code === 0) {
        yield put({
          type: 'show',
          payload: response.data,
        });
      }
    },
    *submit({ payload }, { call, put }) {
      const response = yield call(editMessage, payload);
      if (response.code === 0) {
        message.success('发布成功');
        yield put({
          type: 'edit',
          payload: response.data,
        });
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(deleteFeedback, payload);
      if (response.code === 0) {
        message.success('删除成功');
        yield put({
          type: 'show',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        feedbacks: payload,
      };
    },
    edit(state, { payload }) {
      return {
        ...state,
        feedbacks: payload,
      };
    },
  },
};
