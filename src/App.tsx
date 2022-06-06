import React from 'react';
import { Button, Menu, Icon } from 'antd';

const App = () => {
  return (
    <>
      <Menu mode="horizontal">
        <Menu.Item>
          <Icon type="file" />
          开电子单
        </Menu.Item>
        <Menu.Item>
          <Icon type="book" />
          治疗记录
        </Menu.Item>
      </Menu>
    </>
  );
};

export default App;
