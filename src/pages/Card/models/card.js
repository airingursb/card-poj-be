import { getTicket, updateTicket } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'ticket',

  state: {},

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getTicket, payload);
      if (response.code === 0) {
        yield put({
          type: 'show',
          payload: {
            tickets: response.data,
          },
        });
      }
    },
    *update({ payload }, { call, put }) {
      const response = yield call(updateTicket, payload);
      if (response.code === 0) {
        message.success('修改成功');
        yield put({
          type: 'show',
          payload: {
            tickets: response.data,
          },
        });
      }
    },
  },

  reducers: {
    show(state, { payload }) {
      const { tickets } = payload;
      const keys = ['card_50', 'card_200', 'card_400', 'card_600', 'card_1000', 'card_1200'];
      const tempObj = {};

      tickets.forEach(val => {
        tempObj[keys[val.status - 1]] = val;
      });

      return {
        ...state,
        ...tempObj,
      };
    },
  },
};
