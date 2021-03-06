import React, { Component } from 'react'
import { compose } from 'react-apollo'
import { withRouter } from 'next/router'

import { Loader } from '@project-r/styleguide'

import { Router, routes, cleanAsPath } from '../lib/routes'
import Frame from '../components/Frame'
import Front from '../components/Front'
import StatusError from '../components/StatusError'

import withMembership, {
  UnauthorizedPage
} from '../components/Auth/withMembership'
import withInNativeApp from '../lib/withInNativeApp'

const KNOWN_PATHS = []

const isPathKnown = router => {
  return KNOWN_PATHS.indexOf(cleanAsPath(router.asPath)) !== -1
}

class FrontPage extends Component {
  componentDidMount() {
    this.redirectUser()
  }

  componentDidUpdate() {
    this.redirectUser()
  }

  redirectUser() {
    const { router, isMember, inNativeIOSApp, serverContext } = this.props

    if (isPathKnown(router) && !isMember && !inNativeIOSApp) {
      if (serverContext) {
        const indexPath = routes.find(r => r.name === 'index').toPath()

        serverContext.res.redirect(302, indexPath)
        serverContext.res.end()
      } else {
        Router.pushRoute('index')
      }
    }
  }

  render() {
    const { router, isMember, inNativeIOSApp, serverContext } = this.props

    if (isMember) {
      return <Front extractId={router.query.extractId} {...this.props} />
    }

    if (isPathKnown(router)) {
      if (inNativeIOSApp) {
        return <UnauthorizedPage {...this.props} />
      }

      // ... render Loader while redirect action is pushed to Router
      return (
        <Frame raw>
          <Loader loading style={{ minHeight: 'calc(100vh - 80px)' }} />
        </Frame>
      )
    }

    // If path is neither known (nor is user a member), render a 404 Not Found
    // status page.
    return (
      <Frame raw>
        <StatusError statusCode={404} serverContext={serverContext} />
      </Frame>
    )
  }
}

export default compose(
  withMembership,
  withInNativeApp,
  withRouter
)(FrontPage)
