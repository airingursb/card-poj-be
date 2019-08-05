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
      // 反馈管理模块
      {
        path: '/feedback',
        name: 'feedback',
        icon: 'profile',
        routes: [
          {
            path: '/feedback/list',
            name: 'feedbacklist',
            component: './Feedback/FeedbackList',
            routes: [
              {
                path: '/feedback/detail',
                component: './Feedback/FeedbackDetail',
              },
            ],
          },
          {
            path: '/feedback/detail',
            component: './Feedback/FeedbackDetail',
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
            path: '/task/list_todo',
            name: 'tasklisttodo',
            component: './Task/TaskListToDo',
            routes: [
              {
                path: '/task/detail',
                component: './Task/TaskDetail',
              },
            ],
          },
          {
            path: '/task/list_todo_pro',
            name: 'tasklisttodopro',
            component: './Task/TaskListToDoPro',
            routes: [
              {
                path: '/task/detail',
                component: './Task/TaskDetail',
              },
            ],
          },
          {
            path: '/task/list_ok',
            name: 'tasklistok',
            component: './Task/TaskListOk',
            routes: [
              {
                path: '/task/detail',
                component: './Task/TaskDetail',
              },
            ],
          },
          {
            path: '/task/list_refuse',
            name: 'tasklistrefuse',
            component: './Task/TaskListRefuse',
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
      // 卡券模块
      {
        path: '/card',
        name: 'card',
        icon: 'profile',
        routes: [
          {
            path: '/card/config',
            name: 'cardconfig',
            component: './Card/Card',
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
