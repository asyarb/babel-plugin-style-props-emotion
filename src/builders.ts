import { types as t } from '@babel/core'
import {
  ArrayExpression,
  Expression,
  ObjectExpression,
  ObjectProperty,
} from '@babel/types'
import { SCALE_MAP, THEME_MAP } from './constants'
import { normalizeScale } from './utils'

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

      const themedStyle = t.objectProperty(
        t.identifier(baseKey),
        t.callExpression(t.identifier('getStyle'), [
          t.identifier('theme'),
          t.stringLiteral(key),
          value,
        ])
      )

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
  const styles = value.properties as ObjectProperty[]

  styles.reduce((acc, scale) => {
    if (SCALE_MAP) {
    }
    // const baseKey = scale.key.name as string
    // const key = SCALE_MAP[baseKey] || baseKey
    // const fallbackKey = THEME_MAP[baseKey] || baseKey

    const scaleArr = scale.value as ArrayExpression
    const normalizedScale = normalizeScale(scaleArr)

    console.log(normalizedScale)

    return acc
  }, [])
}
