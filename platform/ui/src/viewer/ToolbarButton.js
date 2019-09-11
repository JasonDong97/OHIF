import './toolbar-button.styl';

import { Icon } from './../elements/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { withTranslation } from '../utils/LanguageProvider';

const isMobile = window.info.isMobile;

export function ToolbarButton(props) {
  const { isActive, icon, labelWhenActive, onClick, t } = props;
  const className = classnames(props.className, { active: isActive });
  const iconProps = typeof icon === 'string' ? { name: icon } : icon;
  const label = isActive && labelWhenActive ? labelWhenActive : props.label;

  const arrowIconName = props.isExpanded ? 'caret-up' : 'caret-down';
  const arrowIcon = props.isExpandable && (
    <Icon name={arrowIconName} className="expand-caret" />
  );

  const handleClick = event => {
    if (onClick) {
      onClick(event, props);
    }
  };
  const styles= props.marginLeft && isMobile?{'marginLeft': props.marginLeft}:{};

  return (
    <div className={className} onClick={handleClick} style={styles}>
      {iconProps && <Icon {...iconProps} />}
      <div className="toolbar-button-label">
        {t(label)}
        {arrowIcon}
      </div>
    </div>
  );
}

ToolbarButton.propTypes = {
  id: PropTypes.string,
  isActive: PropTypes.bool,
  /** Display label for button */
  label: PropTypes.string.isRequired,
  /** Alternative text to show when button is active */
  labelWhenActive: PropTypes.string,
  className: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ]),
  onClick: PropTypes.func,
  /** Determines if we show expandable 'caret' symbol */
  isExpandable: PropTypes.bool,
  /** Direction of expandable 'caret' symbol */
  isExpanded: PropTypes.bool,
  t: PropTypes.func.isRequired,
  marginLeft: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number])
};

ToolbarButton.defaultProps = {
  marginLeft: 0,
  isActive: false,
  className: `toolbar-button${isMobile?'-mobile':''}`,
};

export default withTranslation('Buttons')(ToolbarButton);
