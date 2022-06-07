import React from 'react';
import { Button } from 'antd';
import { navigate } from '@reach/router';

import style from './index.module.less';

const NotFound = () => {
  const onClick = () => navigate('/demo');
  return (
    <div className={style.color}>
      xx
      <Button onClick={onClick}>返回首页</Button>
    </div>
  );
};

export default NotFound;
