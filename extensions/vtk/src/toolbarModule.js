const TOOLBAR_BUTTON_TYPES = {
  COMMAND: 'command',
  SET_TOOL_ACTIVE: 'setToolActive',
};

const definitions = [
  {
    id: 'Crosshairs',
    label: 'Crosshairs',
    icon: 'crosshairs',
    isDisplay: true,
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'enableCrosshairsTool',
    commandOptions: {},
  },
  {
    id: 'WWWC',
    label: 'WWWC',
    icon: 'level',
    isDisplay: true,
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'enableLevelTool',
    commandOptions: {},
  },
  {
    id: 'Rotate',
    label: 'Rotate',
    icon: '3d-rotate',
    isDisplay: true,
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'enableRotateTool',
    commandOptions: {},
  },
  {
    id: 'setBlendModeToComposite',
    label: 'Disable MIP',
    icon: 'times',
    isDisplay: true,
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'setBlendModeToComposite',
    commandOptions: {},
  },
  {
    id: 'setBlendModeToMaximumIntensity',
    label: 'Enable MIP',
    icon: 'soft-tissue',
    isDisplay: true,
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'setBlendModeToMaximumIntensity',
    commandOptions: {},
  },

  {
    id: 'increaseSlabThickness',
    label: 'Increase Slab Thickness',
    icon: 'caret-up',
    isDisplay: true,
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'increaseSlabThickness',
    commandOptions: {},
  },
  {
    id: 'decreaseSlabThickness',
    label: 'Decrease Slab Thickness',
    icon: 'caret-down',
    isDisplay: true,
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'decreaseSlabThickness',
    commandOptions: {},
  },
];

export default {
  definitions,
  defaultContext: 'ACTIVE_VIEWPORT::VTK',
};
