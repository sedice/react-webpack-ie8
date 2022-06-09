import React from 'react';
import './index.less';

interface BfrCardProps {
  title?: string;
  style?: React.CSSProperties;
  renderToolBar?: () => React.ReactNode[];
  wrapperRef?: React.RefObject<HTMLDivElement>;
  className?: string;
}
class BfrCard extends React.PureComponent<BfrCardProps> {
  render() {
    const renderTitle = () => {
      if (this.props.title) {
        return (
          <>
            <span className="bfr-card__title__prefix"></span>
            <span className="bfr-card__title__content">{this.props.title}</span>
          </>
        );
      }
      return null;
    };

    return (
      <div
        className={`bfr-card ${this.props.className}`}
        style={this.props.style}
        ref={this.props.wrapperRef}
      >
        <div className="bfr-card__title">
          {renderTitle()}
          <div className="bfr-card__tool-bar">
            {this.props.renderToolBar?.()}
          </div>
        </div>
        <div className="bfr-card__body">{this.props.children}</div>
      </div>
    );
  }
}

export default BfrCard;
