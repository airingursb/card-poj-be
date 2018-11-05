import {
  queryFakeList,
  removeFakeList,
  addFakeList,
  updateFakeList,
  getUsers,
  findUsers,
  filterUsers,
} from '@/services/api';

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
