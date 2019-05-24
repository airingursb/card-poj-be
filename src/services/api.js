import { stringify } from 'qs';
import request from '@/utils/request';

const HOST = 'http://localhost:3045';
// const HOST = 'https://api.totolelanzhou.com'

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

// 管理员登陆
export async function Login(params) {
  return request(`${HOST}/admin/login`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 用户管理模块
 */

// 获取用户列表
export async function getUsers(params) {
  return request(`${HOST}/admin/users`, {
    method: 'POST',
    body: params,
  });
}

// 查找用户
export async function findUsers(params) {
  return request(`${HOST}/admin/find_user_by_phone`, {
    method: 'POST',
    body: params,
  });
}

// 筛选用户
export async function filterUsers(params) {
  return request(`${HOST}/admin/filter_user_by_status`, {
    method: 'POST',
    body: params,
  });
}

// 用户详情
export async function getUser(params) {
  return request(`${HOST}/admin/user`, {
    method: 'POST',
    body: params,
  });
}

// 审核用户
export async function checkUser(params) {
  return request(`${HOST}/admin/check_user`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 任务管理模块
 */

// 获取审核列表
export async function getTasks(params) {
  return request(`${HOST}/admin/tasks`, {
    method: 'POST',
    body: params,
  });
}

// 过滤审核列表
export async function filterTasks(params) {
  return request(`${HOST}/admin/filter_task_by_status`, {
    method: 'POST',
    body: params,
  });
}

// FIXME: 发布任务（废弃）
export async function createTask(params) {
  return request(`${HOST}/admin/publish_task`, {
    method: 'POST',
    body: params,
  });
}

// 发布任务
export async function createNotice(params) {
  return request(`${HOST}/admin/publish_notice`, {
    method: 'POST',
    body: params,
  });
}

// 删除任务
export async function deleteNotice(params) {
  return request(`${HOST}/admin/delete_notice`, {
    method: 'POST',
    body: params,
  });
}

// 创建或修改消息
export async function editMessage(params) {
  const url = params.id ? `${HOST}/admin/edit_message` : `${HOST}/admin/publish_message`;
  return request(url, {
    method: 'POST',
    body: params,
  });
}

// 删除消息
export async function deleteMessage(params) {
  return request(`${HOST}/admin/delete_message`, {
    method: 'POST',
    body: params,
  });
}

// 获取任务列表
export async function getNotice(params) {
  return request(`${HOST}/admin/notice_list`, {
    method: 'POST',
    body: params,
  });
}

// 获取任务审核详情
export async function getTask(params) {
  return request(`${HOST}/admin/task`, {
    method: 'POST',
    body: params,
  });
}

// 审核任务
export async function checkTask(params) {
  return request(`${HOST}/admin/check_task`, {
    method: 'POST',
    body: params,
  });
}

// 获取通知
export async function getMessages(params) {
  return request(`${HOST}/admin/messages`, {
    method: 'POST',
    body: params,
  });
}

// 获取反馈
export async function getFeedbacks(params) {
  return request(`${HOST}/admin/feedbacks`, {
    method: 'POST',
    body: params,
  });
}

// 删除反馈
export async function deleteFeedback(params) {
  return request(`${HOST}/admin/delete_feedback`, {
    method: 'POST',
    body: params,
  });
}

// 发放卡券
export async function sendCard(params) {
  return request(`${HOST}/admin/send_card`, {
    method: 'POST',
    body: params,
  });
}
