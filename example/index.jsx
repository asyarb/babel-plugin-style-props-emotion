import React from 'react'

export const Example = () => {
  return (
    <div
      someOtherProp={false}
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
          variants: {
            boxStyle: 'lastNoMargin',
          },
        },
      }}
    />
  )
}
