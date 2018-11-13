import {
  getTask,
  getTasks,
  filterTasks,
  checkTask,
  getNotice,
  deleteNotice,
  createNotice,
} from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'task',

  state: {},

  effects: {
    *detail({ payload }, { call, put }) {
      const response = yield call(getTask, payload);
      if (response.code === 0) {
        yield put({
          type: 'info',
          payload: response.data,
        });
      }
    },
    *submit({ payload }, { call, put }) {
      const response = yield call(checkTask, payload);
      if (response.code === 0) {
        message.success('审核成功');
        yield put({
          type: 'info',
          payload: response.data,
        });
      }
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(getTasks, payload);
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
          type: 'showNotice',
          payload: response.data,
        });
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(deleteNotice, payload);
      if (response.code === 0) {
        message.success('删除成功');
        yield put({
          type: 'showNotice',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
    showNotice(state, { payload }) {
      return {
        ...state,
        notice: payload,
      };
    },
    info(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },
};
