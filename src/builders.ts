import { types as t } from '@babel/core'
import { ArrayExpression, Expression, ObjectExpression, ObjectProperty } from '@babel/types'
import { SCALE_MAP, THEME_MAP } from './constants'
import { normalizeScale, normalizeStyle } from './utils'

export const buildThemedResponsiveStyles = (
  objProp: ObjectProperty,
  modifierPrefix?: string
) => {
  const obj = objProp.value as ArrayExpression
  const breakpoints = obj.elements as ObjectExpression[]

  const [mobile, ...responsive] = breakpoints.map((breakpoint, i) => {
    const styles = breakpoint.properties as ObjectProperty[]
    const isMobile = i === 0

    let breakpointStyles = [] as ObjectProperty[]

    styles.forEach(style => {
      const baseKey = style.key.name
      const key = THEME_MAP[baseKey] || baseKey
      const value = style.value as Expression

      const { normalizedStyle, isNegative } = normalizeStyle(value)

      let getStyleCall = t.callExpression(t.identifier('__getStyle'), [
        t.identifier('theme'),
        t.stringLiteral(key),
        normalizedStyle,
      ])

      if (isNegative) {
        //@ts-ignore
        getStyleCall = t.binaryExpression(
          '+',
          t.stringLiteral('-'),
          getStyleCall
        )
      }

      let themedStyle = t.objectProperty(t.identifier(baseKey), getStyleCall)

      breakpointStyles.push(themedStyle)
    })

    if (modifierPrefix)
      breakpointStyles = [
        t.objectProperty(
          t.stringLiteral(modifierPrefix),
          t.objectExpression(breakpointStyles)
        ),
      ]
    if (isMobile) return breakpointStyles

    const breakpointObj = t.objectExpression(breakpointStyles)
    const mediaQueryKey = t.memberExpression(
      t.identifier('theme.mediaQueries'),
      t.numericLiteral(i - 1),
      true
    )

    const mediaQueryStyleObj = t.objectProperty(
      mediaQueryKey,
      breakpointObj,
      true
    )

    return mediaQueryStyleObj
  })

  const mobileStyles = mobile as ObjectProperty[]
  const responsiveStyles = responsive as ObjectProperty[]

  return [mobileStyles, responsiveStyles]
}

export const buildThemedResponsiveScales = (scaleProp: ObjectProperty) => {
  const value = scaleProp.value as ObjectExpression
  const scales = value.properties as ObjectProperty[]

  const mobileScales = [] as ObjectProperty[]
  const responsiveScales = [] as ObjectProperty[][]

  scales.forEach(scale => {
    const baseKey = scale.key.name as string
    const key = SCALE_MAP[baseKey] || baseKey
    const fallbackKey = THEME_MAP[baseKey] || baseKey

    const scaleArr = scale.value as ArrayExpression
    const normalizedScaleArr = normalizeScale(scaleArr) as Expression[]

    normalizedScaleArr.forEach((style, i) => {
      const isMobile = i === 0
      const { normalizedStyle, isNegative } = normalizeStyle(style)

      let getScaleStyleCall = t.callExpression(
        t.identifier('__getScaleStyle'),
        [
          t.identifier('theme'),
          t.stringLiteral(key),
          t.stringLiteral(fallbackKey),
          normalizedStyle,
          t.numericLiteral(i),
        ]
      )

      if (isNegative) {
        //@ts-ignore
        getScaleStyleCall = t.binaryExpression(
          '+',
          t.stringLiteral('-'),
          getScaleStyleCall
        )
      }

      const themedStyle = t.objectProperty(
        t.identifier(baseKey),
        getScaleStyleCall
      )

      if (isMobile) mobileScales.push(themedStyle)
      else {
        responsiveScales[i - 1] = responsiveScales[i - 1] || []
        responsiveScales[i - 1].push(themedStyle)
      }
    })
  })

  const mediaQueryObjs = responsiveScales.map((breakpointStyles, i) => {
    const breakpointObj = t.objectExpression(breakpointStyles)
    const mediaQueryKey = t.memberExpression(
      t.identifier('theme.mediaQueries'),
      t.numericLiteral(i),
      true
    )

    return t.objectProperty(mediaQueryKey, breakpointObj, true)
  })

  return [mobileScales, mediaQueryObjs]
}
