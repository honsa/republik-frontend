import React from 'react'

const Icon = ({ size, fill }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 20 20'
    style={{ verticalAlign: 'middle' }}
  >
    <path
      fill={fill}
      d='M18.3,0 L1.7,0 C0.8,0 0,0.8 0,1.7 L0,18.3 C0,19.2 0.8,20 1.7,20 L18.3,20 C19.2,20 20,19.2 20,18.3 L20,1.7 C20,0.8 19.2,0 18.3,0 Z M10.7,12.3 L6.7,14.6 L6.7,10 L6.7,5.4 L10.7,7.7 L14.6,10 L10.7,12.3 Z'
    />
  </svg>
)

export default Icon
