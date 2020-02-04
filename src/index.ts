import * as BabelTypes from '@babel/types'
import { NodePath, types as t } from '@babel/core'
import {
  JSXAttribute,
  JSXOpeningElement,
  Program,
  JSXIdentifier,
} from '@babel/types'
import htmlTagNames from 'html-tag-names'

import pkg from '../package.json'
import {
  buildThemedResponsiveScales,
  buildThemedResponsiveStyles,
  buildThemedVariantStyles,
} from './builders'
import { DEFAULT_OPTIONS, THEME_IDENTIFIER } from './constants'
import { mergeMobileStyles, mergeResponsiveStyles } from './mergers'
import { extractStyleObjects, extractStyleProp, stripStyleProp } from './utils'

export interface Babel {
  types: typeof BabelTypes
}
export type StylePropExpression = BabelTypes.Expression | null
export type PluginOptions = {
  stripProps: boolean
}

let hasStylePropsInJSX = false

const jsxOpeningElementVisitor = {
  JSXOpeningElement(path: NodePath<JSXOpeningElement>, options: PluginOptions) {
    const allProps = path.node.attributes
    if (!allProps.length) return

    const styleProp = extractStyleProp(allProps) as JSXAttribute
    if (!styleProp) return

    hasStylePropsInJSX = true

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

    if (options.stripProps) path.node.attributes = stripStyleProp(allProps)

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

    // TODO: Extract this to a dedi function
    const elementTagName = (path.node.name as JSXIdentifier).name

    // Traverse back up the path to the root program scope.
    let parent = path.parentPath
    while (!t.isProgram(parent.parentPath)) {
      parent = parent.parentPath
    }

    const styledId = path.scope.generateUidIdentifier('Styled' + elementTagName)

    parent.insertBefore(
      t.variableDeclaration('const', [
        t.variableDeclarator(
          styledId,
          t.callExpression(t.identifier('styled'), [t.identifier('help')])
        ),
      ])
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
        exit(path: NodePath<Program>) {
          if (!hasStylePropsInJSX) return

          path.insertBefore(
            t.importDeclaration(
              [
                t.importSpecifier(
                  path.scope.generateUidIdentifier('getStyle'),
                  t.identifier('getStyle')
                ),
                t.importSpecifier(
                  path.scope.generateUidIdentifier('getScaleStyle'),
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
