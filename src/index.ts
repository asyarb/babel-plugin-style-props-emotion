import { NodePath, types as t } from '@babel/core'
import {
  JSXAttribute,
  JSXOpeningElement,
  Program,
  Expression,
} from '@babel/types'

import pkg from '../package.json'
import {
  buildThemedResponsiveScales,
  buildThemedResponsiveStyles,
  buildThemedVariantStyles,
} from './builders'
import { DEFAULT_OPTIONS, THEME_IDENTIFIER } from './constants'
import { mergeMobileStyles, mergeResponsiveStyles } from './mergers'
import { extractStyleObjects, extractStyleProp, stripStyleProp } from './utils'
export type StylePropExpression = Expression | null
export type PluginOptions = {
  stripInjectedProp: boolean
}

let hasImportedRuntimeForProgram: boolean | null

const jsxOpeningElementVisitor = {
  JSXOpeningElement(path: NodePath<JSXOpeningElement>, options: PluginOptions) {
    const allProps = path.node.attributes
    if (!allProps.length) return

    const styleProp = extractStyleProp(allProps) as JSXAttribute
    if (!styleProp) return

    const {
      base,
      hover,
      focus,
      active,
      scales,
      variants,
    } = extractStyleObjects(styleProp)

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
    const variantStyles = buildThemedVariantStyles(variants)

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

    if (options.stripInjectedProp)
      path.node.attributes = stripStyleProp(allProps)

    const cssObjExpression = t.objectExpression([
      ...mergedMobile,
      ...mergedResponsive,
      ...variantStyles,
    ])

    const cssArrowFunction = t.arrowFunctionExpression(
      [t.identifier(THEME_IDENTIFIER)],
      cssObjExpression
    )

    const cssProp = t.jsxAttribute(
      t.jsxIdentifier('css'),
      t.jsxExpressionContainer(cssArrowFunction)
    )

    path.node.attributes.push(cssProp)
  },
}

export default (_babel: object, opts: PluginOptions) => {
  const options = { ...DEFAULT_OPTIONS, ...opts }

  return {
    name: 'style-props-emotion',
    visitor: {
      Program: {
        enter(path: NodePath<Program>) {
          hasImportedRuntimeForProgram = false

          path.traverse(jsxOpeningElementVisitor, options)
        },
        exit(path: NodePath<Body>) {
          if (hasImportedRuntimeForProgram) return

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

          hasImportedRuntimeForProgram = true
        },
      },
    },
  }
}
