import { NodePath, types as t } from '@babel/core'
import { JSXAttribute, JSXOpeningElement, Program } from '@babel/types'
import {
  buildThemedResponsiveStyles,
  extractStyleObjects,
  extractStyleProp,
} from 'utils'

const jsxOpeningElementVisitor = {
  JSXOpeningElement(path: NodePath<JSXOpeningElement>) {
    const allProps = path.node.attributes
    if (!allProps.length) return

    const styleProp = extractStyleProp(allProps) as JSXAttribute
    if (!styleProp) return

    const { base } = extractStyleObjects(styleProp)
    const themedBase = buildThemedResponsiveStyles(base)

    // Temporary just to test output
    const test = t.objectExpression(themedBase)
    const prop = t.jsxAttribute(
      t.jsxIdentifier('css'),
      t.jsxExpressionContainer(test)
    )

    path.node.attributes.push(prop)
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
