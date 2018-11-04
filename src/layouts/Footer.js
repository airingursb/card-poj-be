import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '零熊 首页',
          title: '零熊 首页',
          href: 'https://oh-bear.github.io',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <Icon type="github" />,
          href: 'https://github.com/oh-bear',
          blankTarget: true,
        },
        {
          key: '太太乐',
          title: '太太乐',
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2018 零熊技术团队出品
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
