import React from 'react'

export const Example = () => {
  return (
    <div
      as="h2"
      __styleProps__={{
        css: {
          base: [
            {
              color: 'red',
            },
          ],
          hover: [{}],
          focus: [{}],
          active: [{}],
        },
        extensions: {
          scales: {},
          variants: {
            boxStyle: 'lastNoMargin',
          },
        },
      }}
    />
  )
}
