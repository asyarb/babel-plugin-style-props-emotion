import React from 'react'

export const Example = () => {
  return (
    <div
      __styleProps__={{
        css: {
          base: [
            {
              margin: '-large',
            },
            {
              margin: '-xlarge',
            },
            {
              margin: 'medium',
            },
            {
              margin: 'large',
            },
          ],
          hover: [{}],
          focus: [{}],
          active: [{}],
        },
        extensions: {
          scales: {
            padding: ['-large'],
          },
        },
      }}
    />
  )
}
