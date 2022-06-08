import React from 'react';
import './index.less';

interface BfrCardProps {
  title?: string;
  style?: React.CSSProperties;
  renderToolBar?: () => React.ReactNode[];
}
class BfrCard extends React.PureComponent<BfrCardProps> {
  render() {
    const renderTitle = () => {
      if (this.props.title) {
        return (
          <>
            <span className="title-prefix"></span>
            <span className="title-content">{this.props.title}</span>
            <div className="title-tool-bar">{this.props.renderToolBar?.()}</div>
          </>
        );
      }
      return null;
    };

    return (
      <div className="bfr-card-wrapper" style={this.props.style}>
        <div className="bfr-card-title">{renderTitle()}</div>
        <div className="bfr-card-body">{this.props.children}</div>
      </div>
    );
  }
}

export default BfrCard;
