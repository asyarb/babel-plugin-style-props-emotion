import { PluginItem, transformSync } from '@babel/core'
import react from '@babel/preset-react'
import emotionPreset from '@emotion/babel-preset-css-prop'
import styleProps from 'babel-plugin-style-props'
import emotionAdapter from '../src'

const presets = [react, emotionPreset]
const plugins = [
  [styleProps, { stripProps: true }],
  [emotionAdapter, { stripProp: true }],
]

const parseCode = (example: string, plug?: PluginItem[]) =>
  transformSync(example, { plugins: plug || plugins, presets })!.code

describe('style props', () => {
  it('parses style props', () => {
    const result = parseCode(`
      <div color='tomato' bg='blue' />
    `)

    expect(result).toMatchSnapshot()
  })
})
