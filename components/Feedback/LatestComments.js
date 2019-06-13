import React, { Component } from 'react'
import { compose } from 'react-apollo'
import { css } from 'glamor'
import { withComments } from './enhancers'
import withT from '../../lib/withT'
import timeago from '../../lib/timeago'

import { GENERAL_FEEDBACK_DISCUSSION_ID } from '../../lib/constants'

import { CommentTeaser, Loader, fontStyles, linkRule } from '@project-r/styleguide'

import CommentLink from '../Discussion/CommentLink'

const styles = {
  button: css({
    ...fontStyles.sansSerifRegular21,
    outline: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    margin: '0 auto 0',
    display: 'block'
  })
}

class LatestComments extends Component {
  render () {
    const { t, data, fetchMore } = this.props

    const timeagoFromNow = createdAtString => {
      return timeago(t, (new Date() - Date.parse(createdAtString)) / 1000)
    }

    return (
      <Loader
        loading={data.loading}
        error={data.error}
        render={() => {
          const { comments } = data
          const { pageInfo } = comments
          return (
            <div>
              {comments && comments.nodes
                .map(
                  node => {
                    const {
                      id,
                      discussion,
                      preview,
                      displayAuthor,
                      published,
                      createdAt,
                      updatedAt,
                      tags,
                      parentIds
                    } = node
                    const meta = (discussion && discussion.document && discussion.document.meta) || {}
                    const isGeneral = discussion.id === GENERAL_FEEDBACK_DISCUSSION_ID
                    const newPage = !isGeneral && meta.template === 'discussion'

                    return (
                      <CommentTeaser
                        key={id}
                        id={id}
                        t={t}
                        displayAuthor={displayAuthor}
                        preview={preview}
                        published={published}
                        createdAt={createdAt}
                        updatedAt={updatedAt}
                        timeago={timeagoFromNow}
                        tags={tags}
                        parentIds={parentIds}
                        Link={CommentLink}
                        discussion={discussion}
                        newPage={newPage}
                      />
                    )
                  }
                )}
              {pageInfo.hasNextPage && (
                <button
                  {...styles.button}
                  {...linkRule}
                  onClick={() => {
                    fetchMore({ after: pageInfo.endCursor })
                  }}
                >
                  {t('feedback/fetchMore')}
                </button>
              )}
            </div>
          )
        }} />
    )
  }
}

export default compose(
  withT,
  withComments()
)(LatestComments)
