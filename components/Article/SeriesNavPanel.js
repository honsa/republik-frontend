import React, { Fragment } from 'react'
import { withRouter } from 'next/router'

import { css } from 'glamor'
import { Link } from '../../lib/routes'
import { timeFormat } from '../../lib/utils/format'
import { romanize } from '../../lib/utils/romanize'
import withT from '../../lib/withT'

import {
  Editorial,
  colors,
  fontStyles,
  mediaQueries,
  TeaserFrontCredit
} from '@project-r/styleguide'

const dayFormat = timeFormat('%d. %B %Y')

const styles = {
  container: css({
    color: colors.negative.text
  }),
  base: css({
    cursor: 'default',
    display: 'block',
    padding: '20px 15px',
    textAlign: 'center',
    '& + &': {
      borderTop: `1px solid ${colors.negative.divider}`
    }
  }),
  link: css({
    textDecoration: 'none',
    color: colors.negative.text,
    ':visited': {
      color: colors.negative.text
    },
    '@media (hover)': {
      ':hover': {
        color: colors.negative.primary
      }
    },
    cursor: 'pointer'
  }),
  current: css({
    backgroundColor: '#fff',
    color: colors.text
  }),
  unpublished: css({
    color: colors.negative.lightText
  }),
  title: css({
    ...fontStyles.serifTitle26,
    [mediaQueries.mUp]: {
      ...fontStyles.serifTitle38
    }
  }),
  date: css({
    ...fontStyles.sansSerifRegular15,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifRegular21
    }
  })
}

const Title = ({ children }) => <h2 {...styles.title}>{children}</h2>

const LinkContent = ({ episode, index, t }) => {
  const label = episode && episode.label
  const publishDate = episode && episode.publishDate
  return (
    <Fragment>
      <Editorial.Format>
        {label || t('article/series/episode', { count: romanize(index + 1) })}
      </Editorial.Format>
      <Title>{episode.title}</Title>
      {!!publishDate && (
        <TeaserFrontCredit>
          {dayFormat(Date.parse(publishDate))}
        </TeaserFrontCredit>
      )}
    </Fragment>
  )
}

const EpisodeLink = withRouter(
  ({ episode, translation, params = {}, router, index, t }) => {
    const route =
      episode.document && episode.document.meta && episode.document.meta.path
    if (!route) {
      return (
        <div {...styles.base} {...styles.unpublished}>
          <LinkContent episode={episode} index={index} t={t} />
        </div>
      )
    }
    if (router.asPath && router.asPath === route) {
      return (
        <div {...styles.base} {...styles.current}>
          <LinkContent episode={episode} index={index} t={t} />
        </div>
      )
    }
    return (
      <Link route={route} params={params}>
        <a {...styles.base} {...styles.link}>
          <LinkContent episode={episode} index={index} t={t} />
        </a>
      </Link>
    )
  }
)

const Nav = ({ children, t, series }) => {
  return (
    <div {...styles.container}>
      {series.episodes &&
        series.episodes.map((episode, i) => (
          <EpisodeLink t={t} key={i} episode={episode} index={i} />
        ))}
    </div>
  )
}

export default withT(Nav)
