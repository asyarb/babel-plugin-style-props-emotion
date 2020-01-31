import { PluginOptions } from './'

export const DEFAULT_OPTIONS = {
  stripProp: false,
} as PluginOptions

export const STYLE_PROPS_ID = '__styleProps__'
export const THEME_IDENTIFIER = 'theme'

export const THEME_MAP = {
  // SPACE
  margin: 'space',
  marginTop: 'space',
  marginRight: 'space',
  marginBottom: 'space',
  marginLeft: 'space',
  marginX: 'space',
  marginY: 'space',
  padding: 'space',
  paddingTop: 'space',
  paddingRight: 'space',
  paddingBottom: 'space',
  paddingLeft: 'space',
  paddingX: 'space',
  paddingY: 'space',
  m: 'space',
  mt: 'space',
  mr: 'space',
  mb: 'space',
  ml: 'space',
  mx: 'space',
  my: 'space',
  p: 'space',
  pt: 'space',
  pr: 'space',
  pb: 'space',
  pl: 'space',
  px: 'space',
  py: 'space',

  // COLOR
  color: 'colors',
  backgroundColor: 'colors',

  // TYPOGRAPHY
  fontFamily: 'fonts',
  fontSize: 'fontSizes',
  fontWeight: 'fontWeights',
  lineHeight: 'lineHeights',
  letterSpacing: 'letterSpacing',

  // LAYOUT
  width: 'sizes',
  height: 'sizes',
  minWidth: 'sizes',
  maxWidth: 'sizes',
  minHeight: 'sizes',
  maxHeight: 'sizes',

  // FLEXBOX -- needs no theme keys

  // GRID LAYOUT
  gridGap: 'space',
  gridRowGap: 'space',
  gridColumnGap: 'space',
  rowGap: 'space',
  columnGap: 'space',
  gap: 'space',

  // BACKGROUND -- needs no theme keys

  // BORDER
  border: 'borders',
  borderTop: 'borders',
  borderRight: 'borders',
  borderBottom: 'borders',
  borderLeft: 'borders',
  borderWidth: 'borderWidths',
  borderColor: 'colors',
  borderTopColor: 'colors',
  borderRightColor: 'colors',
  borderBottomColor: 'colors',
  borderLeftColor: 'colors',
  borderRadius: 'radii',

  // POSITION
  zIndex: 'zIndices',
  top: 'space',
  right: 'space',
  bottom: 'space',
  left: 'space',

  // SHADOW
  boxShadow: 'shadows',
  textShadow: 'shadows',
} as {
  [key: string]: string
}

export const SCALE_MAP = {
  // SPACE
  margin: 'spaceScales',
  marginTop: 'spaceScales',
  marginRight: 'spaceScales',
  marginBottom: 'spaceScales',
  marginLeft: 'spaceScales',
  marginX: 'spaceScales',
  marginY: 'spaceScales',
  padding: 'spaceScales',
  paddingTop: 'spaceScales',
  paddingRight: 'spaceScales',
  paddingBottom: 'spaceScales',
  paddingLeft: 'spaceScales',
  paddingX: 'spaceScales',
  paddingY: 'spaceScales',
  m: 'spaceScales',
  mt: 'spaceScales',
  mr: 'spaceScales',
  mb: 'spaceScales',
  ml: 'spaceScales',
  mx: 'spaceScales',
  my: 'spaceScales',
  p: 'spaceScales',
  pt: 'spaceScales',
  pr: 'spaceScales',
  pb: 'spaceScales',
  pl: 'spaceScales',
  px: 'spaceScales',
  py: 'spaceScales',

  // COLOR
  color: 'colorScales',
  backgroundColor: 'colorScales',

  // TYPOGRAPHY
  fontFamily: 'fontScales',
  fontSize: 'fontSizeScales',
  fontWeight: 'fontWeightScales',
  lineHeight: 'lineHeightScales',
  letterSpacing: 'letterSpacingScales',

  // LAYOUT
  width: 'sizeScales',
  height: 'sizeScales',
  minWidth: 'sizeScales',
  maxWidth: 'sizeScales',
  minHeight: 'sizeScales',
  maxHeight: 'sizeScales',

  // FLEXBOX -- needs no theme keys

  // GRID LAYOUT
  gridGap: 'spaceScales',
  gridRowGap: 'spaceScales',
  gridColumnGap: 'spaceScales',
  rowGap: 'spaceScales',
  columnGap: 'spaceScales',
  gap: 'spaceScales',

  // BACKGROUND -- needs no theme keys

  // BORDER
  border: 'borderScales',
  borderTop: 'borderScales',
  borderRight: 'borderScales',
  borderBottom: 'borderScales',
  borderLeft: 'borderScales',
  borderWidth: 'borderWidthScales',
  borderColor: 'colorScales',
  borderTopColor: 'colorScales',
  borderRightColor: 'colorScales',
  borderBottomColor: 'colorScales',
  borderLeftColor: 'colorScales',
  borderRadius: 'radiiScales',

  // POSITION
  zIndex: 'zIndiceScales',
  top: 'spaceScales',
  right: 'spaceScales',
  bottom: 'spaceScales',
  left: 'spaceScales',

  // SHADOW
  boxShadow: 'shadowScales',
  textShadow: 'shadowScales',
} as {
  [key: string]: string
}
