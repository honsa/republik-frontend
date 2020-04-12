import React from 'react'
import { css } from 'glamor'
import { mediaQueries } from '@project-r/styleguide'

import {
  HEADER_HEIGHT,
  HEADER_HEIGHT_MOBILE,
  HEADER_ICON_SIZE
} from '../constants'

const styles = {
  pad: css({
    display: 'inline-block',
    padding: Math.floor((HEADER_HEIGHT_MOBILE - HEADER_ICON_SIZE) / 2),
    paddingLeft: 0,
    paddingRight: 0,
    [mediaQueries.mUp]: {
      padding: Math.floor((HEADER_HEIGHT - HEADER_ICON_SIZE) / 2),
      paddingLeft: 5,
      paddingRight: 5
    }
  })
}

export default React.forwardRef((props, ref) => (
  <a ref={ref} {...styles.pad} {...props} />
))