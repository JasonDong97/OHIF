import { Icon } from './../../elements/Icon';
import React from 'react';

function StudyListLoadingText() {
  return (
    <div className="loading-text">
      加载中... <Icon name="circle-notch" animation="pulse" />
    </div>
  );
}

export { StudyListLoadingText };
