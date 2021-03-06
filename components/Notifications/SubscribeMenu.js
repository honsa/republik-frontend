import React, { useState, useEffect } from 'react'
import { CalloutMenu } from '@project-r/styleguide'
import SubscribeIcon from './SubscribeIcon'
import { compose, graphql } from 'react-apollo'
import { discussionPreferencesQuery } from '../Discussion/graphql/documents'
import SubscribeCallout from './SubscribeCallout'
import { withRouter } from 'next/router'
import { getSelectedDiscussionPreference } from './SubscribeDebate'
import { css } from 'glamor'

const styles = {
  container: css({
    display: 'inline-block',
    marginLeft: 'auto',
    position: 'relative',
    lineHeight: 'initial',
    '@media print': {
      display: 'none'
    }
  })
}

const checkIfSubscribed = ({ data, subscription }) =>
  (subscription && subscription.active) ||
  (data && getSelectedDiscussionPreference(data) !== 'NONE')

const SubscribeMenu = ({ data, router, discussionId, subscription, style }) => {
  const [isSubscribed, setSubscribed] = useState(
    checkIfSubscribed({ data, subscription })
  )
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => {
        setAnimate(false)
      }, 1 * 1000)
      return () => clearTimeout(timeout)
    }
  }, [animate])

  useEffect(() => {
    setSubscribed(checkIfSubscribed({ data, subscription }))
  }, [data, subscription])

  const icon = <SubscribeIcon animate={animate} isSubscribed={isSubscribed} />

  return (
    <div {...styles.container} style={style}>
      <CalloutMenu
        icon={icon}
        initiallyOpen={router.query && !!router.query.mute}
      >
        <SubscribeCallout
          discussionId={discussionId}
          subscription={subscription}
          setAnimate={setAnimate}
        />
      </CalloutMenu>
    </div>
  )
}

export default compose(
  graphql(discussionPreferencesQuery, {
    skip: props => !props.discussionId
  }),
  withRouter
)(SubscribeMenu)
