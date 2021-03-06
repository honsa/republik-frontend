import React, { Component } from 'react'
import { css } from 'glamor'

import Link from '../Link/Href'

import { styles as iconLinkStyles } from '../IconLink'
import Icon from '../Icons/Discussion'

import { focusSelector } from '../../lib/utils/scroll'

import { withDiscussionCommentsCount } from './graphql/enhancers/withDiscussionCommentsCount'

import { colors, fontStyles } from '@project-r/styleguide'

const styles = {
  a: css({
    '@media print': {
      display: 'none'
    }
  }),
  text: css({
    color: colors.primary,
    marginTop: -1,
    paddingLeft: 4,
    ...fontStyles.sansSerifMedium16
  }),
  icon: css({
    display: 'inline-block',
    marginBottom: -2,
    verticalAlign: 'middle'
  })
}

const IconWithCount = ({ count, small }) => {
  const size = small ? 22 : 24
  const fontSize = small ? '15px' : undefined
  const lineHeight = small ? '20px' : undefined

  return (
    <>
      <span {...styles.icon}>
        <Icon size={size} fill={colors.primary} />
      </span>
      {count > 0 && (
        <span
          {...iconLinkStyles.text}
          {...styles.text}
          style={{ fontSize, lineHeight }}
        >
          {count}
        </span>
      )}
    </>
  )
}

class IconLink extends Component {
  render() {
    const {
      path,
      query,
      discussionPage,
      discussionId,
      discussionCommentsCount,
      style,
      small
    } = this.props
    const patchedStyle = {
      marginLeft: small ? 0 : 20,
      ...style
    }

    if (discussionPage) {
      return (
        <a
          href='#'
          onClick={e => {
            e.preventDefault()
            focusSelector(`[data-discussion-id='${discussionId}']`)
          }}
          {...iconLinkStyles.link}
          {...styles.a}
          style={patchedStyle}
        >
          <IconWithCount small={small} count={discussionCommentsCount} />
        </a>
      )
    }

    return (
      <Link href={path} query={query} passHref>
        <a {...iconLinkStyles.link} {...styles.a} style={patchedStyle}>
          <IconWithCount small={small} count={discussionCommentsCount} />
        </a>
      </Link>
    )
  }
}

export default withDiscussionCommentsCount(IconLink)

export const DiscussionIconLinkWithoutEnhancer = IconLink
