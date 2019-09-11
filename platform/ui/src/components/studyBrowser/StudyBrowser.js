import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ThumbnailEntry } from './ThumbnailEntry';
import ThumbnailEntryDragSource from './ThumbnailEntryDragSource.js';
import './StudyBrowser.styl';

class StudyBrowser extends Component {
  static defaultProps = {
    studies: [],
    supportsDragAndDrop: true,
  };

  static propTypes = {
    metas: PropTypes.array,
    studies: PropTypes.array.isRequired,
    supportsDragAndDrop: PropTypes.bool.isRequired,
    setViewportSpecificData: PropTypes.func.isRequired,
    clearViewportSpecificData: PropTypes.func.isRequired,
    handleSidePanelChange: PropTypes.func
  };
  findDisplaySet(studies, studyInstanceUid, displaySetInstanceUid) {
    const study = studies.find(study => {
      return study.studyInstanceUid === studyInstanceUid;
    });

    if (!study) {
      return;
    }

    return study.displaySets.find(displaySet => {
      return displaySet.displaySetInstanceUid === displaySetInstanceUid;
    });
  }
  onThumbnailClick(study, thumb){
    const activeViewportIndex = window.store.getState().viewports.activeViewportIndex;
    const displaySet = this.findDisplaySet(
      this.props.metas,
      study.studyInstanceUid,
      thumb.displaySetInstanceUid
    );
    this.props.setViewportSpecificData(activeViewportIndex, displaySet);
    if(window.info.isMobile){
      this.props.handleSidePanelChange('left', null)
    }
  };
  render() {
    const studies = this.props.studies;
    const metas = this.props.metas;
    const thumbnails = studies.map((study, studyIndex) => {
      return study.thumbnails.map((thumb, thumbIndex) => {
        if (this.props.supportsDragAndDrop && !window.info.isMobile) {
          return (
            <ThumbnailEntryDragSource
              key={`${studyIndex}_${thumbIndex}`}
              {...study}
              {...thumb}
              id={`${studyIndex}_${thumbIndex}`}
              onClick={()=>this.onThumbnailClick(study, thumb)}
              onDoubleClick={this.onThumbnailDoubleClick}
            />
          );
        } else {
          return (
            <div className="ThumbnailEntryContainer">
              <ThumbnailEntry
                key={`${studyIndex}_${thumbIndex}`}
                {...study}
                {...thumb}
                id={`${studyIndex}_${thumbIndex}`}
                onClick={()=>this.onThumbnailClick(study, thumb)}
                onDoubleClick={this.onThumbnailDoubleClick}
              />
            </div>
          );
        }
      });
    });
    const components = thumbnails.flat();
    const studyInfo =()=>{
      if (metas && metas.length && !window.info.isMobile){
        return (
          <div className="studyInfo">
            <h2>{metas[0].patientName}</h2>
            <div>
              <label>年龄：</label>
              <span>{metas[0].patientAge || ''}</span>
            </div>
            <div>
              <label>编号：</label>
              <span>{metas[0].patientId}</span>
            </div>
          </div>
        )
      } else{
        return ''
      }
    }
    return (
      <>
        {studyInfo()}
        <div className={`StudyBrowser${window.info.isMobile?'-mobile':''}`}>
          <div className="scrollable-study-thumbnails">{components}</div>
        </div>
      </>
    );
  }
}

export { StudyBrowser };
