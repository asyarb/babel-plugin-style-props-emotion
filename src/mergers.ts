import { types as t } from '@babel/core'
import { ObjectExpression, ObjectProperty } from '@babel/types'

export const mergeMobileStyles = (
  base: ObjectProperty[],
  hover: ObjectProperty[],
  focus: ObjectProperty[],
  active: ObjectProperty[]
) => {
  const result = [...base]

  const [hoverObj] = hover
  const [focusObj] = focus
  const [activeObj] = active

  const hoverValue = hoverObj.value as ObjectExpression
  const focusValue = focusObj.value as ObjectExpression
  const activeValue = activeObj.value as ObjectExpression

  const hoverStyles = hoverValue.properties
  const focusStyles = focusValue.properties
  const activeStyles = activeValue.properties

  if (hoverStyles.length) result.push(hoverObj)
  if (focusStyles.length) result.push(focusObj)
  if (activeStyles.length) result.push(activeObj)

  return result
}

export const mergeResponsiveStyles = (
  base: ObjectProperty[],
  hover: ObjectProperty[],
  focus: ObjectProperty[],
  active: ObjectProperty[]
) => {
  const maxBreakpoints = Math.max(
    base.length,
    hover.length,
    focus.length,
    active.length
  )
  const mediaQueryObjects = [] as ObjectProperty[]

  for (let i = 0; i < maxBreakpoints; i++) {
    const breakpointStyles = [] as ObjectProperty[]

    const baseValue = base[i] && (base[i].value as ObjectExpression | false)
    const hoverValue = hover[i] && (hover[i].value as ObjectExpression | false)
    const focusValue = focus[i] && (focus[i].value as ObjectExpression | false)
    const activeValue =
      active[i] && (active[i].value as ObjectExpression | false)

    if (baseValue) {
      const baseStyles = baseValue.properties as ObjectProperty[]
      if (baseStyles.length) breakpointStyles.push(...baseStyles)
    }
    if (hoverValue) {
      const [hoverProperty] = hoverValue.properties as ObjectProperty[]
      const hoverObj = hoverProperty.value as ObjectExpression
      const hoverStyles = hoverObj.properties as ObjectProperty[]

      if (hoverStyles.length) breakpointStyles.push(hoverProperty)
    }
    if (focusValue) {
      const [focusProperty] = focusValue.properties as ObjectProperty[]
      const focusObj = focusProperty.value as ObjectExpression
      const focusStyles = focusObj.properties as ObjectProperty[]

      if (focusStyles.length) breakpointStyles.push(focusProperty)
    }
    if (activeValue) {
      const [activeProperty] = activeValue.properties as ObjectProperty[]
      const activeObj = activeProperty.value as ObjectExpression
      const activeStyles = activeObj.properties as ObjectProperty[]

      if (activeStyles.length) breakpointStyles.push(activeProperty)
    }

    if (breakpointStyles.length)
      mediaQueryObjects.push(
        t.objectProperty(
          t.memberExpression(
            t.identifier('theme.mediaQueries'),
            t.numericLiteral(i),
            true
          ),
          t.objectExpression(breakpointStyles),
          true
        )
      )
  }

  return mediaQueryObjects
}
