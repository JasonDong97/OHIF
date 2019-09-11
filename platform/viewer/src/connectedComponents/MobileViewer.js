import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MODULE_TYPES } from '@ohif/core';
import OHIF from '@ohif/core';
import moment from 'moment';
import ConnectedToolbarRow from './ConnectedToolbarRow.js';
import ConnectedLabellingOverlay from './ConnectedLabellingOverlay';
import ConnectedStudyBrowser from './ConnectedStudyBrowser.js';
import ConnectedViewerMain from './ConnectedViewerMain.js';
import SidePanel from './../components/SidePanel.js';
import { extensionManager } from './../App.js';
import './Viewer.css';

const isMobile = window.info.isMobile;

class MobileViewer extends Component {
  static propTypes = {
    studies: PropTypes.array,
    studyInstanceUids: PropTypes.array,
    onTimepointsUpdated: PropTypes.func,
    onMeasurementsUpdated: PropTypes.func,
    // window.store.getState().viewports.viewportSpecificData
    viewports: PropTypes.object.isRequired,
    // window.store.getState().viewports.activeViewportIndex
    activeViewportIndex: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    OHIF.measurements.MeasurementApi.setConfiguration({
      dataExchange: {
        retrieve: this.retrieveMeasurements,
        store: this.storeMeasurements,
      },
    });

    OHIF.measurements.TimepointApi.setConfiguration({
      dataExchange: {
        retrieve: this.retrieveTimepoints,
        store: this.storeTimepoints,
        remove: this.removeTimepoint,
        update: this.updateTimepoint,
        disassociate: this.disassociateStudy,
      },
    });
  }

  state = {
    isLeftSidePanelOpen: true,
    isRightSidePanelOpen: false,
    selectedRightSidePanel: '',
    selectedLeftSidePanel: 'studies', // TODO: Don't hardcode this
    thumbnails: [],
  };

  retrieveMeasurements = (patientId, timepointIds) => {
    OHIF.log.info('retrieveMeasurements');
    // TODO: Retrieve the measurements from the latest available SR
    return Promise.resolve();
  };

  storeMeasurements = (measurementData, timepointIds) => {
    OHIF.log.info('storeMeasurements');
    // TODO: Store the measurements into a new SR sent to the active server
    return Promise.resolve();
  };

  retrieveTimepoints = filter => {
    OHIF.log.info('retrieveTimepoints');

    // Get the earliest and latest study date
    let earliestDate = new Date().toISOString();
    let latestDate = new Date().toISOString();
    if (this.props.studies) {
      latestDate = new Date('1000-01-01').toISOString();
      this.props.studies.forEach(study => {
        const studyDate = moment(study.studyDate, 'YYYYMMDD').toISOString();
        if (studyDate < earliestDate) {
          earliestDate = studyDate;
        }
        if (studyDate > latestDate) {
          latestDate = studyDate;
        }
      });
    }

    // Return a generic timepoint
    return Promise.resolve([
      {
        timepointType: 'baseline',
        timepointId: 'TimepointId',
        studyInstanceUids: this.props.studyInstanceUids,
        patientId: filter.patientId,
        earliestDate,
        latestDate,
        isLocked: false,
      },
    ]);
  };

  storeTimepoints = timepointData => {
    OHIF.log.info('storeTimepoints');
    return Promise.resolve();
  };

  updateTimepoint = (timepointData, query) => {
    OHIF.log.info('updateTimepoint');
    return Promise.resolve();
  };

  removeTimepoint = timepointId => {
    OHIF.log.info('removeTimepoint');
    return Promise.resolve();
  };

  disassociateStudy = (timepointIds, studyInstanceUid) => {
    OHIF.log.info('disassociateStudy');
    return Promise.resolve();
  };

  onTimepointsUpdated = timepoints => {
    if (this.props.onTimepointsUpdated) {
      this.props.onTimepointsUpdated(timepoints);
    }
  };

  onMeasurementsUpdated = measurements => {
    if (this.props.onMeasurementsUpdated) {
      this.props.onMeasurementsUpdated(measurements);
    }
  };
  handleSidePanelChange = (side, selectedPanel) => {
  const sideClicked = side && side[0].toUpperCase() + side.slice(1);
  const openKey = `is${sideClicked}SidePanelOpen`;
  const selectedKey = `selected${sideClicked}SidePanel`;
  const updatedState = Object.assign({}, this.state);

  const isOpen = updatedState[openKey];
  const prevSelectedPanel = updatedState[selectedKey];
  // RoundedButtonGroup returns `null` if selected button is clicked
  const isSameSelectedPanel =
    prevSelectedPanel === selectedPanel || selectedPanel === null;

  updatedState[selectedKey] = selectedPanel || prevSelectedPanel;

  const isClosedOrShouldClose = !isOpen || isSameSelectedPanel;
  if (isClosedOrShouldClose) {
    updatedState[openKey] = !updatedState[openKey];
  }
  this.setState(updatedState);
};

  componentDidMount() {
    const { studies } = this.props;
    const { TimepointApi, MeasurementApi } = OHIF.measurements;
    const currentTimepointId = 'TimepointId';

    const timepointApi = new TimepointApi(currentTimepointId, {
      onTimepointsUpdated: this.onTimepointsUpdated,
    });

    const measurementApi = new MeasurementApi(timepointApi, {
      onMeasurementsUpdated: this.onMeasurementsUpdated,
    });

    this.currentTimepointId = currentTimepointId;
    this.timepointApi = timepointApi;
    this.measurementApi = measurementApi;

    if (studies) {
      const patientId = studies[0] && studies[0].patientId;

      timepointApi.retrieveTimepoints({ patientId });
      measurementApi.retrieveMeasurements(patientId, [currentTimepointId]);

      this.setState({
        thumbnails: _mapStudiesToThumbnails(studies),
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.studies !== prevProps.studies) {
      const { studies } = this.props;
      const patientId = studies[0] && studies[0].patientId;
      const currentTimepointId = this.currentTimepointId;

      this.timepointApi.retrieveTimepoints({ patientId });
      this.measurementApi.retrieveMeasurements(patientId, [currentTimepointId]);

      this.setState({
        thumbnails: _mapStudiesToThumbnails(studies),
      });
    }
  }

  render() {
    let VisiblePanelLeft, VisiblePanelRight;
    const panelExtensions = extensionManager.modules[MODULE_TYPES.PANEL];

    panelExtensions.forEach(panelExt => {
      panelExt.module.components.forEach(comp => {
        if (comp.id === this.state.selectedRightSidePanel) {
          VisiblePanelRight = comp.component;
        } else if (comp.id === this.state.selectedLeftSidePanel) {
          VisiblePanelLeft = comp.component;
        }
      });
    });
    const styles = isMobile? {fontSize:'12px'}:{};
    return (
      <>
        {/* VIEWPORTS + SIDEPANELS */}
        <div className={`FlexboxLayout${isMobile?'-mobile':''}`}>
          {/* LEFT */}
          <SidePanel from="left" isOpen={this.state.isLeftSidePanelOpen}>
            {VisiblePanelLeft ? (
              <VisiblePanelLeft
                viewports={this.props.viewports}
                activeIndex={this.props.activeViewportIndex}
              />
            ) : (
              <ConnectedStudyBrowser
                studies={this.state.thumbnails}
                metas={this.props.studies}
                handleSidePanelChange={this.handleSidePanelChange.bind(this)} />
            )}
          </SidePanel>

          {/* MAIN */}
          <div className={classNames('main-content')} style={styles}>
            <ConnectedViewerMain studies={this.props.studies} />
          </div>
        </div>
        {/* TOOLBAR */}
        <ConnectedToolbarRow
          isLeftSidePanelOpen={this.state.isLeftSidePanelOpen}
          isRightSidePanelOpen={this.state.isRightSidePanelOpen}
          selectedLeftSidePanel={
            this.state.isLeftSidePanelOpen
              ? this.state.selectedLeftSidePanel
              : ''
          }
          selectedRightSidePanel={
            this.state.isRightSidePanelOpen
              ? this.state.selectedRightSidePanel
              : ''
          }
          handleSidePanelChange={this.handleSidePanelChange.bind(this)}
        />
      </>
    );
  }
}

export default MobileViewer

/**
 * What types are these? Why do we have "mapping" dropped in here instead of in
 * a mapping layer?
 *
 * TODO[react]:
 * - Add sorting of display sets
 * - Add showStackLoadingProgressBar option
 *
 * @param {Study[]} studies
 * @param {DisplaySet[]} studies[].displaySets
 */
const _mapStudiesToThumbnails = function(studies) {
  return studies.map(study => {
    const { studyInstanceUid } = study;

    const thumbnails = study.displaySets.map(displaySet => {
      const {
        displaySetInstanceUid,
        seriesDescription,
        seriesNumber,
        instanceNumber,
        numImageFrames,
      } = displaySet;

      let imageId;
      let altImageText;

      if (displaySet.modality && displaySet.modality === 'SEG') {
        // TODO: We want to replace this with a thumbnail showing
        // the segmentation map on the image, but this is easier
        // and better than what we have right now.
        altImageText = 'SEG';
      } else if (displaySet.images && displaySet.images.length) {
        const imageIndex = Math.floor(displaySet.images.length / 2);

        imageId = displaySet.images[imageIndex].getImageId();
      } else {
        altImageText = displaySet.modality ? displaySet.modality : 'UN';
      }

      return {
        imageId,
        altImageText,
        displaySetInstanceUid,
        seriesDescription,
        seriesNumber,
        instanceNumber,
        numImageFrames,
      };
    });

    return {
      studyInstanceUid,
      thumbnails,
    };
  });
};
