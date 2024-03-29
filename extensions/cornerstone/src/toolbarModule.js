// TODO: A way to add Icons that don't already exist?
// - Register them and add
// - Include SVG Source/Inline?
// - By URL, or own component?

// TODO: `ohif-core` toolbar builder?

// What KINDS of toolbar buttons do we have...
// - One's that dispatch commands
// - One's that set tool's active
// - More custom, like CINE
//    - Built in for one's like this, or custom components?

// Visible?
// Disabled?
// Based on contexts or misc. criteria?
//  -- ACTIVE_ROUTE::VIEWER
//  -- ACTIVE_VIEWPORT::CORNERSTONE
// setToolActive commands should receive the button event that triggered
// so we can do the "bind to this button" magic
const isMobile = window.info.isMobile;

const TOOLBAR_BUTTON_TYPES = {
  COMMAND: 'command',
  SET_TOOL_ACTIVE: 'setToolActive',
  BUILT_IN: 'builtIn',
};

const definitions = [
  {
    id: 'StackScroll',
    label: 'Stack Scroll',
    icon: 'bars',
    isDisplay: false,
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: 'StackScroll' },
  },
  {
    id: 'Zoom',
    label: 'Zoom',
    icon: 'search-plus',
    isDisplay: true,
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: 'Zoom' },
  },
  {
    id: 'Wwwc',
    label: 'Levels',
    icon: 'level',
    isDisplay: isMobile,
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: 'Wwwc' },
  },
  {
    id: 'WwwcMore',
    label: 'WWWC',
    icon: 'level',
    isDisplay: !isMobile,
    buttons:[
      {
        id: 'Wwwc',
        label: 'WWWC',
        icon: 'level',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
        commandName: 'setToolActive',
        commandOptions: { toolName: 'Wwwc' },
      },
      {
        id: 'WwwcRegion',
        label: 'ROI Window',
        icon: 'stop',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
        commandName: 'setToolActive',
        commandOptions: { toolName: 'WwwcRegion' },
      },
      {
        id: 'WwwcBrain',
        label: 'Brain',
        icon: 'brain',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
        commandName: 'setToolActive',
        commandOptions: { toolName: 'Wwwc', type: 'brain' },
      },
      {
        id: 'WwwcLung',
        label: 'Lung',
        icon: 'lung',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
        commandName: 'setToolActive',
        commandOptions: { toolName: 'Wwwc', type: 'lung' },
      },
      {
        id: 'WwwcAbdomen',
        label: 'Abdomen',
        icon: 'abdomen',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
        commandName: 'setToolActive',
        commandOptions: { toolName: 'Wwwc', type:'abdomen' },
      },
      {
        id: 'WwwcBone',
        label: 'Bone',
        icon: 'bone',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
        commandName: 'setToolActive',
        commandOptions: { toolName: 'Wwwc', type: 'bone' },
      },
      {
        id: 'WwwSoftTissue',
        label: 'Soft Tissue',
        icon: 'soft-tissue',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
        commandName: 'setToolActive',
        commandOptions: { toolName: 'Wwwc', type: 'soft-tissue' },
      }
    ]
  },
  {
    id: 'Pan',
    label: 'Pan',
    icon: 'arrows',
    isDisplay: true,
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: 'Pan' },
  },
  {
    id: 'Length',
    label: 'Length',
    icon: 'measure-temp',
    isDisplay: true,
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: 'Length' },
  },
  {
    id: 'Angle',
    label: 'Angle',
    icon: 'angle-left',
    isDisplay: true,
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'setToolActive',
    commandOptions: { toolName: 'Angle' },
  },
  {
    id: 'ReferenceLines',
    label: 'Reference Lines',
    icon: 'reference-line',
    isDisplay: !isMobile,
    type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
    commandName: 'referenceViewport',
  },
  {
    id: 'Cine',
    label: 'CINE',
    icon: 'youtube',
    isDisplay: true,
    type: TOOLBAR_BUTTON_TYPES.BUILT_IN,
    options: {
      behavior: 'CINE',
    },
  },
  {
    id: 'More',
    label: 'More',
    icon: 'ellipse-circle',
    isDisplay: true,
    isExpanded: true,
    buttons: [
      {
        id: 'Magnify',
        label: 'Magnify',
        icon: 'circle',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
        commandName: 'setToolActive',
        commandOptions: { toolName: 'Magnify' },
      },
      {
        id: 'DragProbe',
        label: 'Probe',
        icon: 'dot-circle',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
        commandName: 'setToolActive',
        commandOptions: { toolName: 'DragProbe' },
      },
      {
        id: 'EllipticalRoi',
        label: 'Ellipse',
        icon: 'circle-o',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
        commandName: 'setToolActive',
        commandOptions: { toolName: 'EllipticalRoi' },
      },
      {
        id: 'RectangleRoi',
        label: 'Rectangle',
        icon: 'square-o',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
        commandName: 'setToolActive',
        commandOptions: { toolName: 'RectangleRoi' },
      },
      {
        id: 'Invert',
        label: 'Invert',
        icon: 'adjust',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.COMMAND,
        commandName: 'invertViewport',
      },
      {
        id: 'RotateRight',
        label: 'Rotate Right',
        icon: 'rotate-right',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.COMMAND,
        commandName: 'rotateViewportCW',
      },
      {
        id: 'FlipH',
        label: 'Flip H',
        icon: 'ellipse-h',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.COMMAND,
        commandName: 'flipViewportHorizontal',
      },
      {
        id: 'FlipV',
        label: 'Flip V',
        icon: 'ellipse-v',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.COMMAND,
        commandName: 'flipViewportVertical',
      },
      {
        id: 'Clear',
        label: 'Clear',
        icon: 'trash',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.COMMAND,
        commandName: 'clearAnnotations',
      },
      {
        id: 'Reset',
        label: 'Reset',
        icon: 'reset',
        isDisplay: true,
        type: TOOLBAR_BUTTON_TYPES.COMMAND,
        commandName: 'resetViewport',
      },
    ],
  },
];

export default {
  definitions,
  defaultContext: 'ACTIVE_VIEWPORT::CORNERSTONE',
};
