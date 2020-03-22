import { types as t } from '@babel/core'
import {
  ArrayExpression,
  Expression,
  JSXAttribute,
  JSXExpressionContainer,
  JSXSpreadAttribute,
  NumericLiteral,
  ObjectExpression,
  ObjectProperty,
  Identifier,
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

type ExtractResult = { [key: string]: ObjectProperty }
export const extractStyleObjects = (styleProp: JSXAttribute) => {
  const propValue = styleProp.value as JSXExpressionContainer
  const styles = propValue.expression as ObjectExpression

  const result: ExtractResult = styles.properties.reduce((acc, property) => {
    if (!t.isObjectProperty(property)) return acc

    const id = property.key as Identifier
    const name = id.name as string

    acc[name] = property

    return acc
  }, {} as ExtractResult)

  return result
}

export const normalizeStyle = (style: Expression) => {
  let isNegative = false
  let normalizedStyle = style

  if (t.isStringLiteral(style) && style.value.startsWith('-')) {
    isNegative = true
    normalizedStyle = t.stringLiteral(style.value.substring(1))
  }

  if (t.isUnaryExpression(style) && style.operator === '-') {
    const baseNode = style.argument as NumericLiteral

    isNegative = true
    normalizedStyle = t.numericLiteral(baseNode.value)
  }

  return { normalizedStyle, isNegative }
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
