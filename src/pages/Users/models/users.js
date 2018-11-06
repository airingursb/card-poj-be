import { checkUser, getUser } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'users',

  state: {},

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(checkUser, payload);
      if (response.code === 0) {
        message.success('审核成功');
        yield put({
          type: 'show',
          payload: {
            user: response.data.user,
            tasks: response.data.tasks,
          },
        });
      }
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(getUser, payload);
      if (response.code === 0) {
        yield put({
          type: 'show',
          payload: {
            user: response.data.user,
            tasks: response.data.tasks,
          },
        });
      }
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload.user,
        tasks: payload.tasks,
      };
    },
  },
};
