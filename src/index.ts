import { NodePath, types as t } from '@babel/core'
import { JSXAttribute, JSXOpeningElement, Program } from '@babel/types'
import { mergeMobileStyles, mergeResponsiveStyles } from 'mergers'
import { buildThemedResponsiveStyles } from './builders'
import { extractStyleObjects, extractStyleProp } from './utils'

const jsxOpeningElementVisitor = {
  JSXOpeningElement(path: NodePath<JSXOpeningElement>) {
    const allProps = path.node.attributes
    if (!allProps.length) return

    const styleProp = extractStyleProp(allProps) as JSXAttribute
    if (!styleProp) return

    const { base, hover, focus, active } = extractStyleObjects(styleProp)
    const [mobileBase, responsiveBase] = buildThemedResponsiveStyles(base)
    const [mobileHover, responsiveHover] = buildThemedResponsiveStyles(
      hover,
      '&:hover'
    )
    const [mobileFocus, responsiveFocus] = buildThemedResponsiveStyles(
      focus,
      '&:focus'
    )
    const [mobileActive, responsiveActive] = buildThemedResponsiveStyles(
      active,
      '&:active'
    )

    const mergedMobile = mergeMobileStyles(
      mobileBase,
      mobileHover,
      mobileFocus,
      mobileActive
    )
    const mergedResponsive = mergeResponsiveStyles(
      responsiveBase,
      responsiveHover,
      responsiveFocus,
      responsiveActive
    )

    const cssObj = t.objectExpression([...mergedMobile, ...mergedResponsive])
    const cssProp = t.jsxAttribute(
      t.jsxIdentifier('css'),
      t.jsxExpressionContainer(cssObj)
    )

    path.node.attributes.push(cssProp)
  },
}

export default () => {
  return {
    name: 'style-props-emotion',
    visitor: {
      Program: {
        enter(path: NodePath<Program>) {
          path.traverse(jsxOpeningElementVisitor)
        },
      },
    },
  }
}
