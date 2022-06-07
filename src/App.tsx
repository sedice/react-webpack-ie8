import React from 'react';
import { Button, Menu, Icon } from 'antd';

import { Router } from '@reach/router';
import NotFound from './pages/NotFound';

declare module '@reach/router' {
  export interface RouterProps {
    mode?: string;
  }
}

const Test = () => {
  return <div>test</div>;
};

const Demo = () => {
  return <div>Demoxx</div>;
};

const App = () => {
  return (
    <Router mode="hash">
      <Demo path="/demo" />
      <Test path="/test" />
      <NotFound default />
    </Router>
  );
};

export default App;
