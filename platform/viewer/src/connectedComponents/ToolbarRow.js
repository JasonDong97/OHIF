import './ToolbarRow.css';

import React, { Component } from 'react';
import {
  ExpandableToolMenu,
  RoundedButtonGroup,
  ToolbarButton,
} from '@ohif/ui';
import { commandsManager, extensionManager } from './../App.js';

import ConnectedCineDialog from './ConnectedCineDialog';
import ConnectedLayoutButton from './ConnectedLayoutButton';
import ConnectedExitButton from './ConnectedExitButton';
import ConnectedPluginSwitch from './ConnectedPluginSwitch.js';
import OHIF, { MODULE_TYPES } from '@ohif/core';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
const VTK = "ACTIVE_VIEWPORT::VTK";
const isMobile = window.info.isMobile;
class ToolbarRow extends Component {
  // TODO: Simplify these? isOpen can be computed if we say "any" value for selected,
  // closed if selected is null/undefined
  static propTypes = {
    isLeftSidePanelOpen: PropTypes.bool.isRequired,
    isRightSidePanelOpen: PropTypes.bool.isRequired,
    selectedLeftSidePanel: PropTypes.string.isRequired,
    selectedRightSidePanel: PropTypes.string.isRequired,
    handleSidePanelChange: PropTypes.func,
    activeContexts: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  constructor(props) {
    super(props);

    const toolbarButtonDefinitions = _getVisibleToolbarButtons.call(this);
    // TODO:
    // If it's a tool that can be active... Mark it as active?
    // - Tools that are on/off?
    // - Tools that can be bound to multiple buttons?

    // Normal ToolbarButtons...
    // Just how high do we need to hoist this state?
    // Why ToolbarRow instead of just Toolbar? Do we have any others?
    this.state = {
      toolbarButtons: toolbarButtonDefinitions,
      activeButtons: [],
      isCineDialogOpen: false,
      isShowExit: false
    };

    this._handleBuiltIn = _handleBuiltIn.bind(this);

    const panelModules = extensionManager.modules[MODULE_TYPES.PANEL];
    this.buttonGroups = {
      left: [
        // TODO: This should come from extensions, instead of being baked in
        {
          value: 'studies',
          icon: 'th-large',
          bottomLabel: this.props.t('Series'),
        },
      ],
      right: [],
    };

    panelModules.forEach(panelExtension => {
      const panelModule = panelExtension.module;
      const defaultContexts = Array.from(panelModule.defaultContext);

      // MENU OPTIONS
      panelModule.menuOptions.forEach(menuOption => {
        const contexts = Array.from(menuOption.context || defaultContexts);

        const activeContextIncludesAnyPanelContexts = this.props.activeContexts.some(
          actx => contexts.includes(actx)
        );
        if (activeContextIncludesAnyPanelContexts) {
          const menuOptionEntry = {
            value: menuOption.target,
            icon: menuOption.icon,
            bottomLabel: this.props.t(menuOption.label),
          };
          const from = menuOption.from || 'right';

          this.buttonGroups[from].push(menuOptionEntry);
        }
      });
    });
  }

  componentDidUpdate(prevProps) {
    if(window.handleMPRTime){return}
    const activeContexts = this.props.activeContexts;
    const activeContextsChanged = JSON.stringify(prevProps.activeContexts) !== JSON.stringify(activeContexts);
    if (activeContextsChanged) {
      this.setState({
        activeButtons: [],
        toolbarButtons: _getVisibleToolbarButtons.call(this),
        isShowExit: activeContexts.findIndex((x)=>x==VTK)>-1
      });
    }
  }

  render() {
    const buttonComponents = _getButtonComponents.call(
      this,
      this.state.toolbarButtons,
      this.state.activeButtons
    );

    const cineDialogContainerStyle = {
      display: this.state.isCineDialogOpen ? 'block' : 'none',
      position: 'absolute',
      top: '82px',
      zIndex: 999,
    };

    const onPress = (side, value) => {
      if(isMobile){
        this.setState({
          isCineDialogOpen: false
        })
      }
      this.props.handleSidePanelChange(side, value);
    };
    const onPressLeft = onPress.bind(this, 'left');
    const onPressRight = onPress.bind(this, 'right');
    const styles = isMobile ?
      {
        padding: '5px',
        position: 'fixed',
        left: 0,
        backgroundColor: '#000'
      }
      : { padding: '10px' };
    return (
      <>
        <div className={`ToolbarRow${isMobile?'-mobile':''}`}>
          <div className="pull-left m-t-1 p-y-1 " style={styles}>
            <RoundedButtonGroup
              options={this.buttonGroups.left}
              value={this.props.selectedLeftSidePanel || ''}
              onValueChanged={onPressLeft}
            />
          </div>
          {buttonComponents}
          {!this.state.isShowExit && !isMobile && (
            <ConnectedLayoutButton/>
          )}
          {!isMobile && (!this.state.isShowExit ?
            <ConnectedPluginSwitch/>
            :
            <ConnectedExitButton onExit={()=>{
              this.setState({
                isShowExit: false,
              });
            }}/>)
          }

          {!isMobile && (
            <div
              className="pull-right m-t-1 rm-x-1"
              style={{ marginLeft: 'auto' }}
            >
              {this.buttonGroups.right.length && (
                <RoundedButtonGroup
                  options={this.buttonGroups.right}
                  value={this.props.selectedRightSidePanel || ''}
                  onValueChanged={onPressRight}
                />
              )}
            </div>
          )}
        </div>
        <div className="CineDialogContainer" style={cineDialogContainerStyle}>
          <ConnectedCineDialog isPlaying={this.state.isCineDialogOpen}/>
        </div>
      </>
    );
  }
}

/**
 * Determine which extension buttons should be showing, if they're
 * active, and what their onClick behavior should be.
 */
function _getButtonComponents(toolbarButtons, activeButtons) {
  let btns = [];
  const _handleCineDialog =()=>{
    this.setState({
      isCineDialogOpen: false,
      isShowExit: true
    });
  }
  toolbarButtons.forEach(btn=> {
    if(btn.buttons && btn.buttons.length){
      btn.buttons = btn.buttons.filter(x=>x.isDisplay);
      if(btn.isExpanded){
        btn.buttons.forEach(e=>btns.push(e));
      }
    }
    if(btn.isDisplay && !btn.isExpanded){
      btns.push(btn)
    }
  });
  return btns.map((button, index) => {
    let activeCommand = undefined;

    if (button.buttons && button.buttons.length) {
      // Iterate over button definitions and update `onClick` behavior
      const childButtons = button.buttons.map(childButton => {
        childButton.onClick = _handleToolbarButtonClick.bind(this, childButton);

        if (activeButtons.indexOf(childButton.id) > -1) {
          activeCommand = childButton.id;
        }

        return childButton;
      });
      return (
        <ExpandableToolMenu
          key={button.id}
          label={button.label}
          icon={button.icon}
          buttons={childButtons}
          activeCommand={activeCommand}
        />
      );
    }
    return (
      <ToolbarButton
        key={button.id}
        label={button.label}
        icon={button.icon}
        marginLeft={index ? 0:'60px'}
        onClick={_handleToolbarButtonClick.bind(this, button)}
        onCineDialogOpen={_handleCineDialog}
        isActive={activeButtons.includes(button.id)}
      />
    );
  });
}

/**
 * A handy way for us to handle different button types. IE. firing commands for
 * buttons, or initiation built in behavior.
 *
 * @param {*} button
 * @param {*} evt
 * @param {*} props
 */
function _handleToolbarButtonClick(button, evt, props) {
  if (button.commandName) {
    const options = Object.assign({ evt }, button.commandOptions);
    commandsManager.runCommand(button.commandName, options);
  }

  // TODO: Use Types ENUM
  // TODO: We can update this to be a `getter` on the extension to query
  //       For the active tools after we apply our updates?
  if (button.type === 'setToolActive') {
    this.setState({
      activeButtons: [button.id],
    });
  } else if (button.type === 'builtIn') {
    if(isMobile && this.props.isLeftSidePanelOpen) return;
    this._handleBuiltIn(button.options);
  }
}

/**
 *
 */
function _getVisibleToolbarButtons() {
  const toolbarModules = extensionManager.modules[MODULE_TYPES.TOOLBAR];
  const toolbarButtonDefinitions = [];
  toolbarModules.forEach(extension => {
    const { definitions, defaultContext } = extension.module;
    definitions.forEach(definition => {
      const context = definition.context || defaultContext;
      if (this.props.activeContexts.includes(context)) {
        toolbarButtonDefinitions.push(definition);
      }
    });
  });
  return toolbarButtonDefinitions;
}

function _handleBuiltIn({ behavior } = {}) {
  if (behavior === 'CINE') {
    this.setState({
      isCineDialogOpen: !this.state.isCineDialogOpen,
    });
  }
}
export default withTranslation('Common')(ToolbarRow);
