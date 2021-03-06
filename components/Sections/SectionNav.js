import React from 'react'
import {
  mediaQueries,
  colors,
  fontStyles,
  A,
  FormatTag
} from '@project-r/styleguide'
import { css } from 'glamor'
import { ascending } from 'd3-array'
import { Link } from '../../lib/routes'

const styles = {
  container: css({
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 27,
    [mediaQueries.mUp]: {
      marginTop: -20
    }
  }),
  item: css({
    margin: '8px 15px',
    whiteSpace: 'nowrap'
  }),
  label: css({
    ...fontStyles.sansSerifMedium19,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifMedium26
    }
  }),
  counter: css({
    color: colors.lightText,
    ...fontStyles.sansSerifMedium15,
    [mediaQueries.mUp]: {
      ...fontStyles.sansSerifMedium20
    }
  }),
  link: css({
    color: 'inherit',
    textDecoration: 'none'
  })
}

const SectionNav = ({ color, linkedDocuments = { nodes: [] } }) => {
  if (linkedDocuments.nodes.length < 1) {
    return null
  }
  return (
    <div {...styles.container}>
      {linkedDocuments.nodes
        .filter(d => d.meta.template === 'format')
        .sort((a, b) => ascending(a.meta.title, b.meta.title))
        .map(d => {
          return (
            <div key={d.id} {...styles.item}>
              <Link route={d.meta.path} passHref key={d.meta.path}>
                <a {...styles.link} href={d.meta.path}>
                  <FormatTag
                    color={d.meta.color || color}
                    label={d.meta.title}
                    count={d.linkedDocuments.totalCount || null}
                  />
                </a>
              </Link>
            </div>
          )
        })}
    </div>
  )
}

export default SectionNav
