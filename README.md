# Babel Plugin Style Props Emotion <!-- omit in toc -->

Use responsive and theme aware style props on any JSX element using `emotion`.

```jsx
<h1 sx={{ mt: 0, mb: 4, color: ['primary', 'secondary'] }}>Hello World!</h1>
```

- [Features](#features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configure Babel](#configure-babel)
  - [Setup your `<ThemeProvider>`](#setup-your-themeprovider)
    - [Minimal theme](#minimal-theme)
- [What this plugin does](#what-this-plugin-does)
- [Usage](#usage)
  - [Use values from your theme](#use-values-from-your-theme)
  - [Use function calls, variables, and expressions in style props](#use-function-calls-variables-and-expressions-in-style-props)
  - [Use arrays for responsive styles](#use-arrays-for-responsive-styles)
    - [Variables in responsive styles](#variables-in-responsive-styles)
  - [Use negative values](#use-negative-values)
    - [Negative values with variables and functions](#negative-values-with-variables-and-functions)
  - [Use styleModifier props](#use-stylemodifier-props)
  - [Use custom variants](#use-custom-variants)
  - [Using scales](#using-scales)
    - [Variables in scales](#variables-in-scales)
      - [Referencing theme values in scale styles](#referencing-theme-values-in-scale-styles)
    - [Defining scales in your theme](#defining-scales-in-your-theme)
  - [Stripping the injected prop from HTML and JSX](#stripping-the-injected-prop-from-html-and-jsx)
- [Gotchas](#gotchas)
  - [Breakpoints](#breakpoints)
  - [Nested theme properties](#nested-theme-properties)
  - [Incompatible with `defaultProps`](#incompatible-with-defaultprops)
  - [Incompatible with theme keys that start with `-` (hypen)](#incompatible-with-theme-keys-that-start-with---hypen)
- [License](#license)

## Features

- Support for **all** valid CSS properties.
- Use values from your `<ThemeProvider>`.
- Use plain CSS units and values.
- Use arrays for responsive styles.
- Customizable variants.

## Getting Started

### Installation

```bash
# yarn
yarn add -D babel-plugin-style-props babel-plugin-style-props-emotion

# npm
npm i -D babel-plugin-style-props babel-plugin-style-props-emotion
```

### Configure Babel

Add the appropriate plugins to your Babel config file in the order as shown
below. Be sure that the emotion preset is included in your list of `presets`.

```js
// babel.config.js
module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@emotion/babel-preset-css-prop',
  ],
  plugins: ['babel-plugin-style-props', 'babel-plugin-style-props-emotion'],
}
```

### Setup your `<ThemeProvider>`

Place your `<ThemeProvider>` component around your React app as you normally
would, then pass your `theme` object.

```jsx
import { ThemeProvider } from 'emotion-theming'
import { theme } from './theme'

const YourApp = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
)
```

#### Minimal theme

For a barebones theme to start working with, see this
[example](docs/minimalTheme.js).

Your `theme` should follow the `styled-system` specification that you can find
detailed [here](https://styled-system.com/theme-specification).

## What this plugin does

`babel-plugin-style-props-emotion` converts styles in the `sx` prop to values in
the `css` prop. This allows `emotion` to parse the styles into CSS.

```jsx
// Your JSX
<div sx={{ color: 'red', px: 5 }} />

// Output JSX (simplified)
<div
  css={theme => ({
    color: theme.colors.red,
    paddingLeft: theme.space[5],
    paddingRight: theme.space[5],
  })}
/>
```

## Usage

### Use values from your theme

When colors, fonts, font sizes, a spacing scale, or other values are definied in
a `<ThemeProvider>`, the values can be referenced by key.

```jsx
// example theme
const theme = {
  // ...
  colors: {
    primary: '#07c',
    muted: '#f6f6f9',
  },
}

<div sx={{ color: 'primary', bg: 'muted' }} />
```

### Use function calls, variables, and expressions in style props

Function calls, expressions, and variables are dropped into the `css` prop as
computed properties. Consider the following example:

```jsx
const Box = () => {
  const myColor = 'primary'
  const myFunction = () => 'muted'
  const isLarge = true
  const fallbackSize = 'small'

  return (
    <div
      sx={{
        color: myColor,
        bg: myFunction(),
        mt: isLarge ? 'large' : fallbackSize,
      }}
    />
  )
}

// transpiles to something like:
const Box = () => {
  const myColor = 'primary'
  const myFunction = () => 'muted'
  const isLarge = true
  const fallbackSize = 'small'

  return (
    <div
      css={theme => ({
        color: theme.colors[myColor], // theme.colors.primary
        backgroundColor: theme.colors[myFunction()], // theme.colors.muted
        marginTop: theme.space[isLarge ? 'large' : fallbackSize], // theme.space.large || theme.space.small
      })}
    />
  )
}
```

### Use arrays for responsive styles

You can use arrays to specify responsive styles.

```jsx
<div sx={{ width: '100%', '50%', '25%' }} />
```

Opt a breakpoint by using `null`.

```jsx
<div sx={{ width: [null, '50%', null, '25%'] }} />
```

Responsive arrays will generate styles according to the order of breakpoints
defined in the `mediaQueries` key in your `theme`.

#### Variables in responsive styles

If you are using a variable in a style prop's responsive array, it **cannot** be
an array.

```jsx
const myValue = '1rem'
const myArray = ['1rem', '2rem', '3rem']

// This works:
<div sx={{ m: [myValue, '2rem', '3rem'] }}  />

// This does not:
<div sx={{ m: myArray }} />
```

If you need to dynamically style a responsive array, please see
[Use styleScale props](#using-scales).

### Use negative values

When a style prop has keys that are defined in a `<ThemeProvider>`, you can
negate them by prefixing them with a '-' (hyphen).

```jsx
const theme = {
  // ...
  space: [
    0,
    '5rem'
  ]
}
// theme alias
theme.space.large = theme.space[1]

<div sx={{ mt: '-large', mr: -1 }} />

// transpiles to something like:
<div
  css={theme => ({
    marginTop: '-' + theme.space.large,
    marginRight: '-' + theme.space[1]
  })}
/>

// resulting in:
<div css={theme => ({ marginTop: '-5rem', marginRight: '-5rem' })} />
```

#### Negative values with variables and functions

Due to the nature of static compilation, using a negative theme key in a
variable or a return value of a function will **not** result in the negation of
a theme value.

```jsx
// This will NOT work.
const Box = ({ isNegative }) => {
  const mySpace = isNegative ? '-large' : 'large'

  return <div sx={{ mx: mySpace }}>
}
```

### Use styleModifier props

Every valid CSS rule has a `Hover`, `Focus`, and `Active` modifier that is
available. For example, if you want to apply a style to `opacity` when an
element is being hovered, use the `opacityHover` key.

```jsx
// I will be 50% opacity on mouse hover!
<div sx={{ opacity: 1, opacityHover: 0.5 }} />
```

### Use custom variants

Custom variants and style props can be defined in the base babel plugin options
under `variants`. See below for an example config:

```js
// babel.config.js
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    [
      'babel-plugin-style-props',
      {
        variants: {
          boxStyle: 'boxStyles',
        },
      },
    ],
    'babel-plugin-style-props-emotion',
  ],
}
```

The above config will tell the base `babel-plugin-style-props` to transpile the
`boxStyle` prop on any JSX element to properties in the `css` prop.

```jsx
const theme = {
  // ...
  boxStyles: {
    primary: {
      color: 'white',
      backgroundColor: '#f0f'
    }
  }
}

// `boxStyle` on an element:
<div sx={{ boxStyle: 'primary' }} />

// will transpile to something like:
<div css={theme => ({ ...theme.boxStyles.primary })} />

// which results in:
<div css={theme => ({ color: 'white', backgroundColor: '#f0f' })} />
```

### Using scales

Use `scale` variants for any CSS style. `scale` styles allow you to specify a
set of responsive values for a style prop in a single key, or via an array of
keys and/or values.

This is useful for styles that usually change at every breakpoint such as font
sizes or space values, or when you need to dynamically assign breakpoint values
since normal style props cannot accept dynamic arrays.

See below for an example:

```jsx
<div sx={{ mScale: 'xl' }} />

// transpiles to something like
<div
  css={theme => ({
    margin: theme.spaceScales.xl[0],
    "@media (min-width: 40em)": {
      margin: theme.spaceScales.xl[1]
    },
    "@media (min-width: 52em)": {
      margin: theme.spaceScales.xl[2]
    },
    "@media (min-width: 64em)": {
      margin: theme.spaceScales.xl[3]
    }
  })}
/>
```

Like with normal styles, `scale` styles can be overridden per breakpoint using
an array, be negated with a hyphen, and can use `null` to skip over breakpoints.

```jsx
<div sx={{ mScale: ['xl', null, '-l']}}  />

// transpiles to something like
<div
  css={theme => ({
    margin: theme.spaceScales.xl[0],
    "@media (min-width: 40em)": {
      margin: theme.spaceScales.xl[1]
    },
    "@media (min-width: 52em)": {
      margin: theme.spaceScales.xl[2]
    },
    "@media (min-width: 64em)": {
      margin: "-" + theme.spaceScales.l[3]
    }
  })}
/>
```

Note how the `xl` scale still persists through the second and third breakpoint.
Using scales, we can persist a scale for as long as we need it, then override it
when necessary.

#### Variables in scales

Any variable passed to a scale style **must** be an array or expression that
returns an array. Variable based arrays currently cannot contain `null` to skip
over breakpoints. If you need to skip a breakpoint, just provide the same key
again in the responsive array.

Consider this example:

```jsx

// This works:
const correctArray = ['xl', 'l', 'l', 'xl']
<div sx={{ mScale: correctArray }} />

// This does not work:
const badArray = ['xl', 'l', null, 'xl']
<div sx={{ mScale: badArray }} />
```

##### Referencing theme values in scale styles

Any dynamic array passed to a scale has access to the non-scaled `theme` object
equivalent.

If you are passing a dynamic array to the `colorScale` prop, it will first check
if a `colorScales` property exists, then fallback and check `colors`, then
finally use the raw value if neither would work.

Consider this example:

```jsx
const theme = {
  // ...
  colors: {
    primary: 'red'
  }
  colorScales: {
    secondary: ['blue', 'green', 'black', 'white']
  }
}

const colors = ['primary', 'secondary', 'secondary', '#fff']
<div sx={{ colorScale: colors }} />

// results in something like
<div
  css={theme => ({
    color: theme.colors.primary,
    "@media (min-width: 40em)": {
      color: theme.colorsScales.secondary[1]
    },
    "@media (min-width: 52em)": {
      color: theme.colorsScales.secondary[2]
    },
    "@media (min-width: 64em)": {
      color: '#fff'
    }
  })}
/>
```

#### Defining scales in your theme

Scales follow the same theme specification as detailed above, except each theme
key has `Scales` appended to it. For example, to define the scales for font
sizes, it would exist in your theme as `fontSizesScales`. The associated key
would be `fontSizeScale`.

```jsx
const theme = {
  fontSizesScales: {
    l: ['1rem', '1.15rem', '1.35rem', '1.5rem']
  }
}

<p sx={{ fontSizeScale: "l" }} />
```

### Stripping the injected prop from HTML and JSX

If you would like this babel plugin to strip it's internal injected prop from
your resulting JSX and HTML, specify `stripInjectedProp` in the plugin options
for the emotion adapter.

```js
// babel.config.js
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    'babel-plugin-style-props',
    [
      'babel-plugin-style-props-emotion',
      {
        stripInternalProp: true,
      },
    ],
  ],
}
```

## Gotchas

To achieve a similar API to `styled-system`/`theme-ui` without the performance
cost, this plugin makes some opinionated decisions as to how you can structure
your theme.

### Breakpoints

Currently, this plugin only supports up to **5** breakpoints from your `theme`.
The ability to specify the amount of breakpoints will come in a future release.

### Nested theme properties

This plugin **only** supports two levels of nesting in a `theme` object.
Consider the following example.

```js
// theme.js
const theme = {
  colors: {
    primary: '#fff',
    red: {
      light: '#f0f',
      dark: '#0f0',
    },
  },
  lineHeights: {
    copy: 1.5,
  },
}

<div sx={{ color: "red.light", bg: "primary" }} />
```

The above example will not work since we are accessing a third level of nesting
for our `color`. This is largely how this plugin eliminates the
`styled-system`/`theme-ui` runtime cost.

If you want to have namespaced-like behavior, consider flatly namespacing your
keys as a workaround.

```js
const theme = {
  colors: {
    primary: '#fff',

    'red.light': '#f0f',
    'red.dark': '#0f0',
  },
  lineHeights: {
    copy: 1.5,
  },
}
```

### Incompatible with `defaultProps`

This plugin does not support specifying React's `defaultProps` for default
styles. `defaultProps` get injected into components at runtime, and therefore
cannot be transpiled at buildtime.

If you are composing reusable components with defaults using this plugin, it's
recommended to just set your defaults directly. This babel plugin will handle
merging `sx` objects on components like in the example below:

```jsx
// Grid.js
const Grid = ({ children }) => {
  return <div sx={{ display: 'grid' }}>{children}</div>
}

// => has display: grid; grid-tempalte-columns: 1fr 1fr; column-gap: 1rem;
const Example = () => {
  return <Grid sx={{ gridTemplateColumns: '1fr 1fr', columnGap: '1rem' }} />
}
```

### Incompatible with theme keys that start with `-` (hypen)

This plugin relies on the hyphen preceeding a theme key to determine the
negation of a scale.

## License

MIT.
