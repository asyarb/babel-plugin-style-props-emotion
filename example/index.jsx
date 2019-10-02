import React from 'react'

export const Example = () => {
  const myVar = 'green'

  return (
    <div
      __styleProps__={{
        css: {
          base: [
            {
              color: myVar,
              padding: '3rem',
            },
            {},
            {
              padding: '4rem',
            },
          ],
          hover: [
            {
              color: myVar,
            },
          ],
          focus: [{}],
          active: [{}],
        },
        extensions: {
          scales: {
            margin: ['xl', null, 'l'],
          },
        },
      }}
    />
  )
}
