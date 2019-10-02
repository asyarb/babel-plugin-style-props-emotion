import { types as t } from '@babel/core'
import {
  ArrayExpression,
  Expression,
  JSXAttribute,
  JSXExpressionContainer,
  JSXSpreadAttribute,
  ObjectExpression,
  ObjectProperty,
} from '@babel/types'
import { STYLE_PROPS_ID, THEME_MAP } from './constants'

/**
 * Given a list of props, returns just the internal style prop.
 *
 * @param props
 * @returns The internal `__styleProp__`. If it is not present, `undefined`.
 */
export const extractStyleProp = (
  props: (JSXAttribute | JSXSpreadAttribute)[]
) => {
  return props.find(prop => {
    if (t.isJSXSpreadAttribute(prop)) return false

    const castProp = prop as JSXAttribute
    const propName = castProp.name.name as string

    return propName === STYLE_PROPS_ID
  })
}

export const extractStyleObjects = (styleProp: JSXAttribute) => {
  const propValue = styleProp.value as JSXExpressionContainer
  const styles = propValue.expression as ObjectExpression

  const [css, extensions] = styles.properties as ObjectProperty[]

  const cssValue = css.value as ObjectExpression
  const extensionsValue = extensions.value as ObjectExpression

  const [base, hover, focus, active] = cssValue.properties as ObjectProperty[]
  const [scales] = extensionsValue.properties as ObjectProperty[]

  return {
    css,
    extensions,
    base,
    hover,
    focus,
    active,
    scales,
  }
}

export const buildThemedResponsiveStyles = (objProp: ObjectProperty) => {
  const obj = objProp.value as ArrayExpression
  const breakpoints = obj.elements as ObjectExpression[]

  const [mobile, ...responsiveStyles] = breakpoints.map((breakpoint, i) => {
    const styles = breakpoint.properties as ObjectProperty[]
    const isMobile = i === 0

    const breakpointStyles = [] as ObjectProperty[]

    styles.forEach(style => {
      const baseKey = style.key.name
      const key = THEME_MAP[baseKey] || baseKey
      const value = style.value as Expression

      const themedStyle = t.objectProperty(
        t.identifier(key),
        t.callExpression(t.identifier('getStyle'), [
          t.identifier('theme'),
          t.stringLiteral(key),
          value,
        ])
      )

      breakpointStyles.push(themedStyle)
    })

    if (isMobile) return breakpointStyles

    const breakpointObj = t.objectExpression(breakpointStyles)
    const mediaQueryKey = t.binaryExpression(
      '+',
      t.binaryExpression(
        '+',
        t.stringLiteral('@media screen and (min-width: '),
        t.memberExpression(
          t.identifier('theme.breakpoints'),
          t.numericLiteral(i - 1),
          true
        )
      ),
      t.stringLiteral(')')
    )

    const mediaQueryStyleObj = t.objectProperty(
      mediaQueryKey,
      breakpointObj,
      true
    )

    return mediaQueryStyleObj
  })

  const mobileStyles = mobile as ObjectProperty[]

  return [...mobileStyles, ...responsiveStyles] as ObjectProperty[]
}
