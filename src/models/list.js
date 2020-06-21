import {
  queryFakeList,
  removeFakeList,
  addFakeList,
  updateFakeList,
  getUsers,
  findUsers,
  filterUsers,
  sendCard,
  resetCard,
} from '@/services/api';

import { message } from 'antd';

export default {
  namespace: 'list',

  state: {
    list: [],
  },

  effects: {
    *users({ payload }, { call, put }) {
      const response = yield call(getUsers, payload);
      // successfully
      if (response.code === 0) {
        yield put({
          type: 'queryList',
          payload: Array.isArray(response.data) ? response.data : [],
        });
      }
    },
    *find({ payload }, { call, put }) {
      const response = yield call(findUsers, payload);
      // successfully
      if (response.code === 0) {
        yield put({
          type: 'queryList',
          payload: Array.isArray(response.data) ? response.data : [],
        });
      }
    },
    *filter({ payload }, { call, put }) {
      const response = yield call(filterUsers, payload);
      // successfully
      if (response.code === 0) {
        yield put({
          type: 'queryList',
          payload: Array.isArray(response.data) ? response.data : [],
        });
      }
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      } else {
        callback = addFakeList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    *send({ payload }, { call }) {
      const response = yield call(sendCard, payload);
      if (response.code === 0) {
        message.success('自动发券成功');
      }
    },
    *reset({ payload }, { call }) {
      const response = yield call(resetCard, payload);
      if (response.code === 0) {
        message.success('清理卡券成功');
        return true;
      }
      message.error(response.message || '清理卡券失败');
      return false;
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
