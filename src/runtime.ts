type StyleProp = string | number
type ScaleProp = string[] | number[]

type Theme = {
  [key: string]: {
    [key: string]: StyleProp | ScaleProp
  }
}

type ScaleTheme = {
  [key: string]: {
    [key: string]: ScaleProp
  }
}

export const getStyle = (theme: Theme, key: string, value: string | number) => {
  if (theme[key] && theme[key][value] !== undefined) return theme[key][value]

  return value
}

export const getScaleStyle = (
  theme: ScaleTheme,
  scaleKey: string,
  baseKey: string | number,
  value: string | number,
  mediaIndex: number
) => {
  if (value === undefined) return null

  if (theme[scaleKey] && theme[scaleKey][value] !== undefined)
    return theme[scaleKey][value][mediaIndex]

  if (theme[baseKey] && theme[baseKey][value] !== undefined)
    return theme[baseKey][value]

  return value
}
