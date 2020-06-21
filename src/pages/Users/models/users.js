import {
  getCode,
  checkUser,
  getUser,
  updateShopStatus,
  deleteZombie,
  deleteUser,
  setFulfil,
} from '@/services/api';
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
    *modify({ payload }, { call, put }) {
      const response = yield call(updateShopStatus, payload);
      if (response.code === 0) {
        message.success('修改成功');
        yield put({
          type: 'update',
          payload: {
            user: response.data.user,
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
    *delAll({ payload }, { call }) {
      const response = yield call(deleteZombie, payload);
      if (response.code === 0) {
        message.success('删除僵尸用户成功');
        return true;
      }
      message.error(response.message || '删除僵尸用户失败');
      return false;
    },
    *delUser({ payload }, { call }) {
      const response = yield call(deleteUser, payload);
      if (response.code === 0) {
        message.success('删除用户成功');
      }
    },
    *fulfil({ payload }, { call, put }) {
      const response = yield call(setFulfil, payload);
      if (response.code === 0) {
        yield put({
          type: 'update',
          payload: {
            user: response.data,
          },
        });
        message.success('修改用户回款状态成功');
      }
    },
    *code({ payload }, { call }) {
      const response = yield call(getCode, payload);
      if (response.code === 0) {
        message.success('获取验证码成功');
        return response;
      }

      message.error('获取验证码失败');
      return false;
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
    update(state, { payload }) {
      return {
        ...state,
        ...payload.user,
      };
    },
  },
};
