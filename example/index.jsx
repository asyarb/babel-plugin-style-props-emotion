import React from 'react'

export const Example = () => {
  return (
    <div
      __styleProps__={{
        css: {
          base: [
            {
              margin: -1,
            },
            {
              margin: -2,
            },
            {
              margin: 3,
            },
            {
              margin: 4,
            },
          ],
          hover: [{}],
          focus: [{}],
          active: [{}],
        },
        extensions: {
          scales: {
            padding: [-1],
          },
        },
      }}
    />
  )
}
