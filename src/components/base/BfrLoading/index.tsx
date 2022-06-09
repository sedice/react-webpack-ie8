import React from 'react';
import './index.less';

const BrfLoading: React.FC<{
  loading?: boolean;
  children: React.ReactNode;
  size?: 'default' | 'small';
}> = ({ loading, children, size = 'default' }) => {
  return (
    <div className="bfr-loading">
      {children}
      <div
        className="bfr-loading__mask"
        style={{
          display: loading ? 'block' : 'none',
        }}
      >
        <div className={`bfr-loading__img bfr-loading__img--size-${size}`}>
          <img src="/ie8_static/loading.gif" alt="" />
        </div>
      </div>
    </div>
  );
};

export default BrfLoading;
