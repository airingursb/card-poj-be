import { getTicket, updateTicket } from '@/services/api';

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
      return {
        ...state,
        card_50: tickets.filter(val => val.status === 2)[0],
        card_200: tickets.filter(val => val.status === 1)[0],
      };
    },
  },
};
