import React from 'react';
import ReactDOM from 'react-dom';
import 'create-react-class'; // needed by antd 1.x
import 'reset.css';
import '../../node_modules/antd/dist/antd.less';
import '@/assets/styles/global.less';

import CrateAdvice from '@/pages/CreateAdvice';

ReactDOM.render(<CrateAdvice />, document.getElementById('app'));
