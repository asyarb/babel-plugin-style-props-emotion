import { PluginItem, transformSync } from '@babel/core'
import react from '@babel/preset-react'
import emotionPreset from '@emotion/babel-preset-css-prop'
import styleProps from 'babel-plugin-style-props'

import emotionAdapter from '../src'

const presets = [react, emotionPreset]
const plugins = [
  [
    styleProps,
    {
      stripProps: true,
      variants: {
        boxStyle: 'boxStyles',
      },
    },
  ],
  [emotionAdapter, { stripProp: true }],
]

const parseCode = (example: string, plug?: PluginItem[]) =>
  transformSync(example, { plugins: plug || plugins, presets })!.code

describe('style prop parsing', () => {
  it('handles style props', () => {
    const example = `
      const Example = () => {
        return <div m='3rem' lineHeight={1.5} />
      }
    `
    const code = parseCode(example)

    expect(code).toMatchSnapshot()
  })

  it('handles responsive style props', () => {
    const example = `
      const Example = () => {
        return <div m={['3rem', '4rem']} display='grid' pt={[null, '4rem', null, '6rem']} />
      }
    `
    const code = parseCode(example)

    expect(code).toMatchSnapshot()
  })

  it('handles variable usage in style props', () => {
    const example = `
      const Example = ({ size }) => {
        const variable = '3rem'
        const myFunction = () => '4rem'
        
        return <div m={[variable, size, myFunction()]} />
      }
    `
    const code = parseCode(example)

    expect(code).toMatchSnapshot()
  })

  it('handles expressions in style props', () => {
    const example = `
      const Example = ({ isTest }) => {
        return <div m={isTest ? '3rem' : '4rem'} />
      }
    `
    const code = parseCode(example)

    expect(code).toMatchSnapshot()
  })

  it('handles style props on multiple elements', () => {
    const example = `
      const Example = () => {
        return (
          <div m='1rem'>
            <span p='2rem' />
          </div>
        )
      }
    `
    const code = parseCode(example)

    expect(code).toMatchSnapshot()
  })

  it('merges parsed props with an existing __styleProps__ prop', () => {
    const example = `
      const Example = () => {
        return (
          <div
            p={['1rem', '2rem', '3rem', '4rem']}
            __styleProps__={{
              css: {
                base: [
                  {
                    color: 'red',
                  },
                ],
                hover: [
                  {
                    color: 'blue',
                  },
                ],
                focus: [
                  {
                    color: 'purple',
                  },
                ],
                active: [
                  {
                    color: 'green',
                  },
                ],
              },
              extensions: {
                scales: {
                  margin: ['xl'],
                },
                variants: {},
              },
            }}
          />
        )
      }
    `
    const code = parseCode(example)

    expect(code).toMatchSnapshot()
  })
})

describe('scale prop parsing', () => {
  it('handles scale props', () => {
    const example = `
      const Example = () => {
        return <div mScale='l' />
      }
    `
    const code = parseCode(example)

    expect(code).toMatchSnapshot()
  })

  it('handles responsive scale props', () => {
    const example = `
      const Example = () => {
        return <div mScale={['l', null, 'm']} />
      }
    `
    const code = parseCode(example)

    expect(code).toMatchSnapshot()
  })

  it('handles variable arrays in scale props', () => {
    const example = `
      const Example = () => {
        const array = ['l', 'l', 'm', 'm', 'xl']

        return <div mScale={array} />
      }
    `
    const code = parseCode(example)

    expect(code).toMatchSnapshot()
  })

  it('merges scale props with an existing __styleProps__ prop', () => {
    const example = `
      const Example = () => {
        return (
          <div
            mScale='l'
            __styleProps__={{
              css: {
                base: [
                  {
                    color: 'red',
                  },
                ],
                hover: [
                  {
                    color: 'blue',
                  },
                ],
                focus: [
                  {
                    color: 'purple',
                  },
                ],
                active: [
                  {
                    color: 'green',
                  },
                ],
              },
              extensions: {
                scales: {
                  padding: ['xl'],
                },
                variants: {},
              },
            }} 
          />
        )
      }
    `
    const code = parseCode(example)

    expect(code).toMatchSnapshot()
  })
})

describe('modifiers', () => {
  it('handles modifier props', () => {
    const example = `
      const Example = () => {
        return <div color='red' colorHover='blue' colorFocus='green' colorActive='purple' />
      }
    `
    const code = parseCode(example)

    expect(code).toMatchSnapshot()
  })

  it('handles responsive modifier props', () => {
    const example = `
      const Example = () => {
        return <div colorHover={['red', null, 'green']} />
      }
    `
    const code = parseCode(example)

    expect(code).toMatchSnapshot()
  })

  it('supports variable usage in modifier props', () => {
    const example = `
      const Example = () => {
        const color = 'red'

        return <div colorHover={[color, null, 'green']} />
      }
    `
    const code = parseCode(example)

    expect(code).toMatchSnapshot()
  })

  it('supports merging with an existing __styleProps__ with modifier props', () => {
    const example = `
      const Example = () => {
        const color = 'red'

        return (
          <div
            m='3rem'
            mHover='4rem'
            mFocus={['5rem', '6rem']}
            mActive={['6rem', '7rem', null, '8rem']} 
            __styleProps__={{
              css: {
                base: [
                  {
                    color: 'red',
                  },
                ],
                hover: [
                  {
                    color: 'blue',
                  },
                ],
                focus: [
                  {
                    color: 'purple',
                  },
                ],
                active: [
                  {
                    color: 'green',
                  },
                ],
              },
              extensions: {
                scales: {
                  padding: ['xl'],
                },
                variants: {},
              },
            }}
          />
        )
      }
    `
    const code = parseCode(example)

    expect(code).toMatchSnapshot()
  })
})

describe('kitchen sink', () => {
  it('handles a large amount of scale and style props', () => {
    const example = `
      const Example = () => {
        const array = ['l', 'l', 'm', 'm', 'xl']
        const variable = 'huge'

        return (
          <div 
            display='flex'
            mScale={array}
            fontSize={['1rem', '2rem', null, '3rem']} 
            color='green'
            colorHover='red'
            colorFocus={['red', 'green', 'blue']}
            lineHeight={1.5} 
            pyScale={['l', null, 'xxl']}
            textTransform='uppercase'
            fontFamily='system-ui'
            maxWidth={variable}
          />
        )
      }
    `
    const code = parseCode(example)

    expect(code).toMatchSnapshot()
  })
})
