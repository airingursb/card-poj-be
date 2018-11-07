import { getTasks, filterTasks, createTask } from '@/services/api';

export default {
  namespace: 'task',

  state: {},

  effects: {
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
      yield call(createTask, payload);
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
  },
};
