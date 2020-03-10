import React from 'react'
import { compose } from 'react-apollo'
import gql from 'graphql-tag'

import { Center, Interaction } from '@project-r/styleguide'

import withT from '../../lib/withT'

import Box from '../Frame/Box'
import { onDocumentFragment as bookmarkOnDocumentFragment } from '../Bookmarks/fragments'
import { WithoutMembership } from '../Auth/withMembership'

import DocumentListContainer from './DocumentListContainer'

const getFeedDocuments = gql`
  query getFeedDocuments($formatId: String!, $cursor: String) {
    documents(format: $formatId, first: 30, after: $cursor, feed: true) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        id
        ...BookmarkOnDocument
        meta {
          credits
          title
          description
          publishDate
          path
          template
          format {
            id
            meta {
              kind
            }
          }
          estimatedReadingMinutes
          estimatedConsumptionMinutes
          indicateChart
          indicateGallery
          indicateVideo
          audioSource {
            mp3
          }
          ownDiscussion {
            id
            closed
            comments {
              totalCount
            }
          }
          linkedDiscussion {
            id
            path
            closed
            comments {
              totalCount
            }
          }
        }
      }
    }
  }
  ${bookmarkOnDocumentFragment}
`

const Feed = ({ t, formatId, subscription }) => (
  <Center>
    <DocumentListContainer
      feedProps={{ showHeader: false }}
      help={
        <WithoutMembership
          render={() => (
            <Box style={{ padding: '15px 20px' }}>
              <Interaction.P>{t('format/feed/payNote')}</Interaction.P>
            </Box>
          )}
        />
      }
      showTotal={true}
      query={getFeedDocuments}
      variables={{
        formatId,
        subscription
      }}
    />
  </Center>
)

export default compose(withT)(Feed)
