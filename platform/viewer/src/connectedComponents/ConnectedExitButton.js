import OHIF from "@ohif/core";
import { commandsManager } from "./../App.js";
import { connect } from "react-redux";
import { ToolbarButton } from '@ohif/ui';
const { setLayout } = OHIF.redux.actions;
const TOOLBAR_BUTTON_TYPES = {
  BUILT_IN: 'builtIn',
  COMMAND: 'command',
  SET_TOOL_ACTIVE: 'setToolActive',
};
const mapStateToProps = state => {
  const { activeViewportIndex, layout, viewportSpecificData } = state.viewports;

  return {
    activeViewportIndex,
    viewportSpecificData,
    layout
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLayout: data => {
      dispatch(setLayout(data));
    }
  };
};

function setSingleLayoutData(originalArray, viewportIndex, data) {
  const viewports = originalArray.slice();
  const layoutData = Object.assign({}, viewports[viewportIndex], data);

  // viewports[viewportIndex] = layoutData;

  return [layoutData];
}

const mergeProps = (propsFromState, propsFromDispatch, ownProps) => {
  const { activeViewportIndex, layout } = propsFromState;
  const { setLayout } = propsFromDispatch;
  const button = {
    id: 'Exit',
    label: 'Exit',
    icon: 'exit',
    active: false,
    type: TOOLBAR_BUTTON_TYPES.BUILT_IN,
    options: {
      behavior: 'EXIT',
    },
    onClick: () => {
      const layoutData = setSingleLayoutData(
        layout.viewports,
        activeViewportIndex,
        { plugin: 'cornerstone', width: '100%' }
      );
      setLayout({ viewports: layoutData });
    }
  }

  return button;
};

const ConnectedExitButton = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ToolbarButton);

export default ConnectedExitButton;
