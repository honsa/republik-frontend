import React from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import Frame from '../components/Frame'
import Front from '../components/Front'
import Marketing from '../components/Marketing'
import withT from '../lib/withT'
import withMembership from '../components/Auth/withMembership'

import { PUBLIC_BASE_URL, CDN_FRONTEND_BASE_URL } from '../lib/constants'

const IndexPage = ({ t, isMember, router }) => {
  if (
    router.query.stale !== 'marketing' &&
    (isMember || router.query.extractId)
  ) {
    // does it's own meta
    return <Front extractId={router.query.extractId} finite />
  }

  const meta = {
    pageTitle: t('pages/index/pageTitle'),
    title: t('pages/index/title'),
    description: t('pages/index/description'),
    image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`,
    url: `${PUBLIC_BASE_URL}/`
  }
  return (
    <Frame raw meta={meta}>
      <Marketing />
    </Frame>
  )
}

const EnhancedPage = compose(withMembership, withT, withRouter)(IndexPage)

export default EnhancedPage
