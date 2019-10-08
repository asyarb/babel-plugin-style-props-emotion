import { NodePath, types as t } from '@babel/core'
import { JSXAttribute, JSXOpeningElement, Program } from '@babel/types'
import pkg from '../package.json'
import { Babel, PluginOptions } from '../types'
import {
  buildThemedResponsiveScales,
  buildThemedResponsiveStyles,
} from './builders'
import { DEFAULT_OPTIONS } from './constants'
import { mergeMobileStyles, mergeResponsiveStyles } from './mergers'
import { extractStyleObjects, extractStyleProp, stripStyleProp } from './utils'

let fileHasStylePropsInJSX: boolean

const jsxOpeningElementVisitor = {
  JSXOpeningElement(path: NodePath<JSXOpeningElement>, options: PluginOptions) {
    fileHasStylePropsInJSX = false

    const allProps = path.node.attributes
    if (!allProps.length) return

    const styleProp = extractStyleProp(allProps) as JSXAttribute
    if (!styleProp) return

    fileHasStylePropsInJSX = true

    const { base, hover, focus, active, scales } = extractStyleObjects(
      styleProp
    )

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
    const [mobileScales, responsiveScales] = buildThemedResponsiveScales(scales)

    const mergedMobile = mergeMobileStyles(
      mobileBase,
      mobileScales,
      mobileHover,
      mobileFocus,
      mobileActive
    )
    const mergedResponsive = mergeResponsiveStyles(
      responsiveBase,
      responsiveScales,
      responsiveHover,
      responsiveFocus,
      responsiveActive
    )

    if (options.stripProp) path.node.attributes = stripStyleProp(allProps)

    const cssObj = t.objectExpression([...mergedMobile, ...mergedResponsive])
    const cssProp = t.jsxAttribute(
      t.jsxIdentifier('css'),
      t.jsxExpressionContainer(cssObj)
    )

    path.node.attributes.push(cssProp)
  },
}

export default (_babel: Babel, opts: PluginOptions) => {
  const options = { ...DEFAULT_OPTIONS, ...opts }

  return {
    name: 'style-props-emotion',
    visitor: {
      Program: {
        enter(path: NodePath<Program>) {
          path.traverse(jsxOpeningElementVisitor, options)
        },
        exit(path: NodePath<Body>) {
          if (!fileHasStylePropsInJSX) return

          //@ts-ignore
          path.unshiftContainer(
            'body',
            t.importDeclaration(
              [
                t.importSpecifier(
                  t.identifier('__getStyle'),
                  t.identifier('getStyle')
                ),
                t.importSpecifier(
                  t.identifier('__getScaleStyle'),
                  t.identifier('getScaleStyle')
                ),
              ],
              t.stringLiteral(pkg.name + '/runtime')
            )
          )
        },
      },
    },
  }
}
