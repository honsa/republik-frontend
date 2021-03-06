import React from 'react'
import {
  colors,
  Interaction,
  Center,
  RawHtml,
  linkRule,
  mediaQueries,
  Label,
  fontStyles
} from '@project-r/styleguide'
import StickySection from '../Feed/StickySection'
import CommentNotification from './CommentNotification'
import InfiniteScroll from '../Frame/InfiniteScroll'
import { timeFormat } from '../../lib/utils/format'
import { nest } from 'd3-collection'
import { css } from 'glamor'
import DocumentNotification from './DocumentNotification'
import { Link } from '../../lib/routes'
import withT from '../../lib/withT'

const dateFormat = timeFormat('%A,\n%d.%m.%Y')

const groupByDate = nest().key(n => {
  return dateFormat(new Date(n.createdAt))
})

const styles = {
  container: css({
    paddingTop: 15,
    paddingBottom: 120,
    [mediaQueries.mUp]: {
      paddingTop: 40
    }
  }),
  more: css({
    position: 'relative',
    height: 50,
    padding: '20px 0 0 0'
  }),
  reloadBanner: css({
    backgroundColor: colors.primaryBg
  }),
  reloadBannerButton: css({
    cursor: 'pointer',
    textDecoration: 'underline'
  }),
  unpublished: css({
    borderTop: `1px solid ${colors.text}`,
    margin: 0,
    paddingTop: 10,
    paddingBottom: 40
  }),
  unpublishedTitle: css({
    ...fontStyles.sansSerifMedium14,
    [mediaQueries.mUp]: fontStyles.sansSerifMedium16,
    margin: '5px 0 3px'
  }),
  unpublishedBody: css({
    ...fontStyles.serifRegular14,
    [mediaQueries.mUp]: fontStyles.serifRegular16,
    margin: 0
  })
}

const ReloadBanner = withT(({ t, futureNotifications, onReload }) =>
  futureNotifications ? (
    <div {...styles.reloadBanner}>
      <Center>
        <Interaction.P>
          {t.pluralize('Notifications/refresh', {
            count: futureNotifications
          })}{' '}
          <span {...styles.reloadBannerButton} onClick={() => onReload()}>
            {t('Notifications/refresh/link')}
          </span>
        </Interaction.P>
      </Center>
    </div>
  ) : null
)

export default withT(
  ({
    t,
    notifications,
    me,
    loadedAt,
    fetchMore,
    futureNotifications,
    onReload
  }) => {
    const { nodes, totalCount, unreadCount, pageInfo } = notifications
    const hasNextPage = pageInfo && pageInfo.hasNextPage

    const loadMore = () =>
      fetchMore({
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const geNodes = data => data.notifications.nodes
          const prevNodes = geNodes(previousResult)
          const moreNodes = geNodes(fetchMoreResult)
          const mergedNodes = prevNodes
            .concat(moreNodes)
            .filter(
              (node, index, all) =>
                all.findIndex(n => n.id === node.id) === index
            )
          return {
            ...fetchMoreResult,
            notifications: {
              ...fetchMoreResult.notifications,
              nodes: mergedNodes
            }
          }
        },
        variables: {
          after: pageInfo && pageInfo.endCursor
        }
      })

    const isNew = node => !node.readAt || loadedAt < new Date(node.readAt)

    if (!nodes) return null
    const isEmpty = !nodes.length

    return (
      <>
        <ReloadBanner
          futureNotifications={futureNotifications}
          onReload={onReload}
        />
        <Center {...styles.container}>
          <div style={{ marginBottom: 40 }}>
            <Interaction.H1 style={{ marginBottom: 20 }}>
              {isEmpty
                ? t('Notifications/empty/title')
                : t.pluralize('Notifications/title', {
                    count: unreadCount
                  })}
            </Interaction.H1>

            <Link route='subscriptionsSettings' passHref>
              <a {...linkRule}>{t('Notifications/settings')}</a>
            </Link>

            {isEmpty && (
              <Interaction.P style={{ marginTop: 40 }}>
                <RawHtml
                  dangerouslySetInnerHTML={{
                    __html: t('Notifications/empty/paragraph')
                  }}
                />
              </Interaction.P>
            )}
          </div>

          <InfiniteScroll
            hasMore={hasNextPage}
            loadMore={loadMore}
            totalCount={totalCount}
            currentCount={nodes.length}
            loadMoreStyles={styles.more}
          >
            {groupByDate.entries(nodes).map(({ key, values }, i, all) => {
              return (
                <StickySection
                  key={i}
                  hasSpaceAfter={i < all.length - 1}
                  label={key}
                >
                  {values.map((node, j) => {
                    if (
                      !node.object ||
                      (node.object.__typename === 'Comment' &&
                        !node.object.published)
                    ) {
                      return (
                        <div
                          {...styles.unpublished}
                          style={{
                            backgroundColor: isNew(node)
                              ? colors.primaryBg
                              : 'none'
                          }}
                          key={j}
                        >
                          <Label>{t('Notifications/unpublished/label')}</Label>
                          {node.content && (
                            <>
                              <h3 {...styles.unpublishedTitle}>
                                {node.content.title}
                              </h3>
                              <p {...styles.unpublishedBody}>
                                {node.content.body}
                              </p>
                            </>
                          )}
                        </div>
                      )
                    }
                    return node.object.__typename === 'Document' ? (
                      <DocumentNotification
                        isNew={isNew(node)}
                        node={node}
                        me={me}
                        key={j}
                      />
                    ) : (
                      <CommentNotification
                        isNew={isNew(node)}
                        node={node}
                        key={j}
                      />
                    )
                  })}
                </StickySection>
              )
            })}
          </InfiniteScroll>
        </Center>
      </>
    )
  }
)
