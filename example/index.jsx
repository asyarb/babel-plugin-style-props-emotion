import React from 'react'

export const Example = () => {
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
