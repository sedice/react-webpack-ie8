import React from 'react';
import { test } from './api/index';
import { Button, Card } from 'antd';

const App = () => {
  test().then((a) => {
    console.log(a);
  });

  return (
    <>
      <Card>sss</Card>
      <Button type="primary">卧槽不ccc是dd吧从ddd</Button>;
    </>
  );
};

export default App;
