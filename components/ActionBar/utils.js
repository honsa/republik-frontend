import { routes } from '../../lib/routes'

export const getDiscussionIconLinkProps = (
  linkedDiscussion,
  ownDiscussion,
  template,
  path
) => {
  const isLinkedDiscussion =
    linkedDiscussion &&
    template === 'article' &&
    (!linkedDiscussion.closed ||
      (linkedDiscussion.comments && linkedDiscussion.comments.totalCount > 0))
  const isOwnDiscussion =
    !isLinkedDiscussion &&
    ownDiscussion &&
    (!ownDiscussion.closed ||
      (ownDiscussion.comments && ownDiscussion.comments.totalCount > 0))
  const isArticleAutoDiscussion = isOwnDiscussion && template === 'article'
  const isDiscussionPage = isOwnDiscussion && template === 'discussion'
  const discussionCount =
    (isLinkedDiscussion &&
      linkedDiscussion.comments &&
      linkedDiscussion.comments.totalCount) ||
    (isOwnDiscussion &&
      ownDiscussion.comments &&
      ownDiscussion.comments.totalCount) ||
    undefined

  const discussionId =
    (isLinkedDiscussion && linkedDiscussion.id) ||
    (isOwnDiscussion && ownDiscussion.id) ||
    undefined
  const discussionPath =
    (isLinkedDiscussion && linkedDiscussion.path) ||
    (isArticleAutoDiscussion &&
      routes.find(r => r.name === 'discussion').toPath()) ||
    (isDiscussionPage && path) ||
    undefined
  const discussionQuery = isArticleAutoDiscussion
    ? { t: 'article', id: ownDiscussion.id }
    : undefined

  return {
    discussionId,
    discussionPath,
    discussionQuery,
    discussionCount,
    isDiscussionPage
  }
}
