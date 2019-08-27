import './OHIFLogo.css';

// import { Icon } from '@ohif/ui';
import React from 'react';
import logoUrl from './favicon.png';

function OHIFLogo(showStudyList) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="header-brand"
      href="http://ohif.org"
    >
      {/*<Icon name="ohif-logo" className="header-logo-image" />*/}
      {/*<div className="header-logo-text">Open Health Imaging Foundation</div>*/}
      <img src={logoUrl} alt={'logo'} height={showStudyList?'30px':'50px'}/>
      <div className="header-logo-text">影联网</div>
    </a>
  );
}

export default OHIFLogo;
