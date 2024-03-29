import { connect } from 'react-redux';
import { StudyBrowser } from '@ohif/ui';
import cloneDeep from 'lodash.clonedeep';
import OHIF from '@ohif/core';
import { commandsManager } from '../App';
import viewports from '@ohif/core/src/redux/reducers/viewports';
const {
  setViewportSpecificData,
  clearViewportSpecificData
} = OHIF.redux.actions;
// TODO
// - Determine in which display set is active from Redux (activeViewportIndex and layout viewportData)
// - Pass in errors and stack loading progress from Redux
const mapStateToProps = (state, ownProps) => {
  // If we know that the stack loading progress details have changed,
  // we can try to update the component state so that the thumbnail
  // progress bar is updated
  const stackLoadingProgressMap = state.loading.progress;
  const studiesWithLoadingData = cloneDeep(ownProps.studies);
  studiesWithLoadingData.forEach(study => {
    study.thumbnails.forEach(data => {
      const { displaySetInstanceUid } = data;
      const stackId = `StackProgress:${displaySetInstanceUid}`;
      const stackProgressData = stackLoadingProgressMap[stackId];

      let stackPercentComplete = 0;
      if (stackProgressData) {
        stackPercentComplete = stackProgressData.percentComplete;
      }

      data.stackPercentComplete = stackPercentComplete;
    });
  });
  return {
    studies: studiesWithLoadingData,
    metas: ownProps.metas
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setViewportSpecificData: (viewportIndex, data) => {
      const viewports = window.store.getState().viewports;
      const {viewportSpecificData, activeViewportIndex} = viewports;
      const viewportData = viewportSpecificData[activeViewportIndex]
      if(viewportSpecificData && viewportData && viewportData.plugin ==  "vtk"){
        window.handleMPRTime = setTimeout(() => {
          commandsManager.runCommand("mpr2d");
          clearTimeout(window.handleMPRTime)
          window.handleMPRTime = null;
        }, 800);
        dispatch(clearViewportSpecificData());
        dispatch(setViewportSpecificData(viewportIndex, data));
      }else {
        dispatch(setViewportSpecificData(viewportIndex, data));
      }
    },
    clearViewportSpecificData: () => {
      dispatch(clearViewportSpecificData());
    }
  };
};
const ConnectedStudyBrowser = connect(
  mapStateToProps,
  mapDispatchToProps
)(StudyBrowser);

export default ConnectedStudyBrowser;
