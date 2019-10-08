import { types as t } from '@babel/core'
import {
  ArrayExpression,
  JSXAttribute,
  JSXExpressionContainer,
  JSXSpreadAttribute,
  ObjectExpression,
  ObjectProperty,
} from '@babel/types'
import { STYLE_PROPS_ID } from './constants'

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

export const normalizeScale = (scale: ArrayExpression) => {
  const elements = [...scale.elements]

  for (let i = 0; i < 5; i++) {
    if (t.isNullLiteral(elements[i]) || elements[i] === undefined) {
      elements[i] = elements[i - 1] || t.nullLiteral()
    }
  }

  return elements
}

export const stripStyleProp = (
  props: (JSXAttribute | JSXSpreadAttribute)[]
) => {
  return props.filter(prop => {
    if (t.isJSXSpreadAttribute(prop)) return true

    const propName = prop.name.name
    if (propName === '__styleProps__') return false

    return true
  })
}
