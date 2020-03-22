import { transformSync, parse } from '@babel/core'
import react from '@babel/preset-react'
import emotionPreset from '@emotion/babel-preset-css-prop'
import styleProps from 'babel-plugin-style-props'

import emotionAdapter from '../src'

const presets = [react, emotionPreset]
const plugins = [
  [
    styleProps,
    {
      variants: {
        boxStyle: 'boxStyles',
      },
    },
  ],
  [emotionAdapter, { stripInjectedProp: true }],
]

const parseCode = (example: string) =>
  transformSync(example, { plugins, presets })!.code

it('parses the styles', () => {
  const example = `const Comp = () => <div sx={{ mb: '3rem', lineHeight: 4 }} />`
  const code = parseCode(example)

  expect(code).toMatchInlineSnapshot(`
    "import { getStyle as __getStyle, getScaleStyle as __getScaleStyle } from \\"babel-plugin-style-props-emotion/runtime\\";
    import { jsx as ___EmotionJSX } from \\"@emotion/core\\";

    const Comp = () => ___EmotionJSX(\\"div\\", {
      sx: {
        mb: '3rem',
        lineHeight: 4
      },
      css: theme => ({
        marginBottom: __getStyle(theme, \\"space\\", '3rem'),
        lineHeight: __getStyle(theme, \\"lineHeights\\", 4)
      })
    });"
  `)
})

it('parses scale styles', () => {
  const example = `const Comp = () => <div sx={{ mxScale: 'l', mbScale: ['l', null, 'xl'] }} />`
  const code = parseCode(example)

  expect(code).toMatchInlineSnapshot(`
    "import { getStyle as __getStyle, getScaleStyle as __getScaleStyle } from \\"babel-plugin-style-props-emotion/runtime\\";
    import { jsx as ___EmotionJSX } from \\"@emotion/core\\";
    
    const Comp = () => ___EmotionJSX(\\"div\\", {
      sx: {
        mxScale: 'l',
        mbScale: ['l', null, 'xl']
      },
      css: theme => ({
        marginLeft: __getScaleStyle(theme, \\"spaceScales\\", \\"space\\", 'l', 0),
        marginRight: __getScaleStyle(theme, \\"spaceScales\\", \\"space\\", 'l', 0),
        marginBottom: __getScaleStyle(theme, \\"spaceScales\\", \\"space\\", 'l', 0),
        [theme.mediaQueries[0]]: {
          marginLeft: __getScaleStyle(theme, \\"spaceScales\\", \\"space\\", 'l', 1),
          marginRight: __getScaleStyle(theme, \\"spaceScales\\", \\"space\\", 'l', 1),
          marginBottom: __getScaleStyle(theme, \\"spaceScales\\", \\"space\\", 'l', 1)
        },
        [theme.mediaQueries[1]]: {
          marginLeft: __getScaleStyle(theme, \\"spaceScales\\", \\"space\\", 'l', 2),
          marginRight: __getScaleStyle(theme, \\"spaceScales\\", \\"space\\", 'l', 2),
          marginBottom: __getScaleStyle(theme, \\"spaceScales\\", \\"space\\", 'xl', 2)
        },
        [theme.mediaQueries[2]]: {
          marginLeft: __getScaleStyle(theme, \\"spaceScales\\", \\"space\\", 'l', 3),
          marginRight: __getScaleStyle(theme, \\"spaceScales\\", \\"space\\", 'l', 3),
          marginBottom: __getScaleStyle(theme, \\"spaceScales\\", \\"space\\", 'xl', 3)
        },
        [theme.mediaQueries[3]]: {
          marginLeft: __getScaleStyle(theme, \\"spaceScales\\", \\"space\\", 'l', 4),
          marginRight: __getScaleStyle(theme, \\"spaceScales\\", \\"space\\", 'l', 4),
          marginBottom: __getScaleStyle(theme, \\"spaceScales\\", \\"space\\", 'xl', 4)
        }
      })
    });"
  `)
})

it('parses psuedoClasses', () => {
  const example = `const Comp = () => <div sx={{ colorHover: 'red' }} />`
  const code = parseCode(example)

  expect(code).toMatchInlineSnapshot(`
    "import { getStyle as __getStyle, getScaleStyle as __getScaleStyle } from \\"babel-plugin-style-props-emotion/runtime\\";
    import { jsx as ___EmotionJSX } from \\"@emotion/core\\";
    
    const Comp = () => ___EmotionJSX(\\"div\\", {
      sx: {
        colorHover: 'red'
      },
      css: theme => ({
        \\"&:hover\\": {
          color: __getStyle(theme, \\"colors\\", 'red')
        }
      })
    });"
  `)
})

it('parses responsive arrays', () => {
  const example = `const Comp = () => <div sx={{ color: ['red', 'blue', null, 'green'] }} />`
  const code = parseCode(example)

  expect(code).toMatchInlineSnapshot(`
    "import { getStyle as __getStyle, getScaleStyle as __getScaleStyle } from \\"babel-plugin-style-props-emotion/runtime\\";
    import { jsx as ___EmotionJSX } from \\"@emotion/core\\";
    
    const Comp = () => ___EmotionJSX(\\"div\\", {
      sx: {
        color: ['red', 'blue', null, 'green']
      },
      css: theme => ({
        color: __getStyle(theme, \\"colors\\", 'red'),
        [theme.mediaQueries[0]]: {
          color: __getStyle(theme, \\"colors\\", 'blue')
        },
        [theme.mediaQueries[2]]: {
          color: __getStyle(theme, \\"colors\\", 'green')
        }
      })
    });"
  `)
})

it('handles variable usage', () => {
  const example = `
    const Comp = ({ size }) => {
      const variable = '3rem'
      const myFunction = () => '4rem'

      return <div sx={{ mb: [variable, size, myFunction()] }} />
    } 
  `
  const code = parseCode(example)

  expect(code).toMatchInlineSnapshot(`
    "import { getStyle as __getStyle, getScaleStyle as __getScaleStyle } from \\"babel-plugin-style-props-emotion/runtime\\";
    import { jsx as ___EmotionJSX } from \\"@emotion/core\\";
    
    const Comp = ({
      size
    }) => {
      const variable = '3rem';
    
      const myFunction = () => '4rem';
    
      return ___EmotionJSX(\\"div\\", {
        sx: {
          mb: [variable, size, myFunction()]
        },
        css: theme => ({
          marginBottom: __getStyle(theme, \\"space\\", variable),
          [theme.mediaQueries[0]]: {
            marginBottom: __getStyle(theme, \\"space\\", size)
          },
          [theme.mediaQueries[1]]: {
            marginBottom: __getStyle(theme, \\"space\\", myFunction())
          }
        })
      });
    };"
  `)
})

it('parses expressions', () => {
  const example = `const Comp = ({ isRed }) => <div sx={{ color: isRed ? 'red' : 'blue' }} />`
  const code = parseCode(example)

  expect(code).toMatchInlineSnapshot(`
    "import { getStyle as __getStyle, getScaleStyle as __getScaleStyle } from \\"babel-plugin-style-props-emotion/runtime\\";
    import { jsx as ___EmotionJSX } from \\"@emotion/core\\";
    
    const Comp = ({
      isRed
    }) => ___EmotionJSX(\\"div\\", {
      sx: {
        color: isRed ? 'red' : 'blue'
      },
      css: theme => ({
        color: __getStyle(theme, \\"colors\\", isRed ? 'red' : 'blue')
      })
    });"
  `)
})

it('parses multiple elements', () => {
  const example = `
    const Comp = () => {
      return (
        <div sx={{ mt: '1rem' }}>
          <span sx={{ textAlign: 'left' }} /> 
        </div>
      )
    } 
  `
  const code = parseCode(example)

  expect(code).toMatchInlineSnapshot(`
    "import { getStyle as __getStyle, getScaleStyle as __getScaleStyle } from \\"babel-plugin-style-props-emotion/runtime\\";
    import { jsx as ___EmotionJSX } from \\"@emotion/core\\";
    
    const Comp = () => {
      return ___EmotionJSX(\\"div\\", {
        sx: {
          mt: '1rem'
        },
        css: theme => ({
          marginTop: __getStyle(theme, \\"space\\", '1rem')
        })
      }, ___EmotionJSX(\\"span\\", {
        sx: {
          textAlign: 'left'
        },
        css: theme => ({
          textAlign: __getStyle(theme, \\"textAlign\\", 'left')
        })
      }));
    };"
  `)
})

it('parses variants', () => {
  const example = `const Comp = () => <div sx={{ boxStyle: 'primary' }} />`
  const code = parseCode(example)

  expect(code).toMatchInlineSnapshot(`
    "import { getStyle as __getStyle, getScaleStyle as __getScaleStyle } from \\"babel-plugin-style-props-emotion/runtime\\";
    import { jsx as ___EmotionJSX } from \\"@emotion/core\\";
    
    const Comp = () => ___EmotionJSX(\\"div\\", {
      sx: {
        boxStyle: 'primary'
      },
      css: theme => ({ ...theme.boxStyle.primary
      })
    });"
  `)
})
