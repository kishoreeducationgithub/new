import React from 'react'

import { Data } from '../App'

const ComponetC = () => {
  return (
    <div>
      <Data.Consumer>
        {
          (name) => name.map((n) => <h1>{n}</h1>)
        }
      </Data.Consumer>
    </div>
  )
}

export default ComponetC
