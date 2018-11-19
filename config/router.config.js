export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/users/list' },
      // 用户管理模块
      { path: '/users', redirect: '/users/list' },
      {
        path: '/users',
        name: 'users',
        icon: 'user',
        routes: [
          {
            path: '/users/list',
            name: 'userlist',
            component: './Users/Users',
            routes: [
              {
                path: '/users/profile',
                component: './Users/Profile',
              },
            ],
          },
          {
            path: '/users/profile',
            component: './Users/Profile',
          },
        ],
      },
      // 通知管理模块
      {
        path: '/message',
        name: 'message',
        icon: 'profile',
        routes: [
          {
            path: '/message/list',
            name: 'messagelist',
            component: './Message/MessageList',
            routes: [
              {
                path: '/message/detail',
                component: './Message/MessageDetail',
              },
            ],
          },
          {
            path: '/message/detail',
            component: './Message/MessageDetail',
          },
        ],
      },
      // 任务管理模块
      {
        path: '/task',
        name: 'task',
        icon: 'check-circle-o',
        routes: [
          {
            path: '/task/show',
            name: 'taskshow',
            component: './Task/NoticeList',
          },
          {
            path: '/task/list',
            name: 'tasklist',
            component: './Task/TaskList',
            routes: [
              {
                path: '/task/detail',
                component: './Task/TaskDetail',
              },
            ],
          },
          {
            path: '/task/detail',
            component: './Task/TaskDetail',
          },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
