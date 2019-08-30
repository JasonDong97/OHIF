import OHIF from "@ohif/core";
import { connect } from "react-redux";
import { ToolbarButton } from '@ohif/ui';
const { setLayout, clearViewportSpecificData } = OHIF.redux.actions;
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
    },
    clearViewportSpecificData: (viewportIndex) => {
      dispatch(clearViewportSpecificData(viewportIndex));
    }
  };
};

function setSingleLayoutData(originalArray, viewportIndex, data) {
  const viewports = originalArray.slice();
  const layoutData = Object.assign({}, viewports[viewportIndex], data);
  return [layoutData];
}

const mergeProps = (propsFromState, propsFromDispatch, ownProps) => {
  const { activeViewportIndex, layout, viewportSpecificData } = propsFromState;
  const { setLayout, clearViewportSpecificData} = propsFromDispatch;
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
      Object.values(viewportSpecificData).forEach((data, index)=>{
        clearViewportSpecificData(index);
      })
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
