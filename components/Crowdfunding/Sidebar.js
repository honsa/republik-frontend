import React, { Component, useState } from 'react'
import { gql, graphql } from 'react-apollo'
import withT from '../../lib/withT'
import { compose } from 'react-apollo'
import { errorToString } from '../../lib/utils/errors'
import withInNativeApp from '../../lib/withInNativeApp'
import { Link } from '../../lib/routes'

import { PackageItem, PackageBuffer } from '../Pledge/Accordion'

import { withStatus, RawStatus } from './Status'

import { css } from 'glamor'

import { HEADER_HEIGHT } from '../constants'
import { SIDEBAR_WIDTH } from './constants'

import {
  Button,
  P,
  A,
  Label,
  colors,
  mediaQueries
} from '@project-r/styleguide'

export const minWindowHeight = 400

const styles = {
  container: css({
    paddingTop: 10,
    [mediaQueries.onlyS]: {
      marginBottom: 30
    }
  }),
  sticky: css({
    display: 'none',
    [mediaQueries.mUp]: {
      display: 'block',
      position: 'fixed',
      zIndex: 1,
      width: SIDEBAR_WIDTH,
      top: HEADER_HEIGHT,
      backgroundColor: '#fff'
    }
  }),
  button: css({
    marginBottom: 10,
    [mediaQueries.onlyS]: {
      display: 'none'
    }
  }),
  links: css({
    lineHeight: '24px',
    marginTop: 13,
    fontSize: 16
  }),
  packages: css({
    fontSize: 19,
    lineHeight: '28px',
    marginBottom: 15
  })
}

const SidebarInner = props => {
  const {
    t,
    onChange,
    crowdfunding,
    title,
    links,
    packages,
    primaryParams
  } = props

  const [hover, setHover] = useState()

  return (
    <div {...styles.container}>
      <div {...styles.packages}>{title}</div>
      {packages.map(pack => {
        return (
          <Link
            key={pack.name}
            route='pledge'
            params={{ package: pack.name, ...pack.params }}
            passHref
          >
            <PackageItem
              t={t}
              crowdfundingName={crowdfunding.name}
              {...pack}
              hover={hover}
              setHover={setHover}
            />
          </Link>
        )
      })}
      <PackageBuffer />
      <div style={{ margin: '20px 0' }}>
        <div {...styles.button}>
          <Link route='pledge' params={primaryParams} passHref>
            <Button block primary>
              Mitmachen
            </Button>
          </Link>
        </div>
      </div>
      <div {...styles.links}>
        {links.map((link, i) =>
          link.route ? (
            <Link key={i} route={link.route} params={link.params} passHref>
              <A>
                {link.text}
                <br />
              </A>
            </Link>
          ) : (
            <A key={i} href={link.href}>
              {link.text}
              <br />
            </A>
          )
        )}
      </div>
    </div>
  )
}

class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.onScroll = () => {
      const y = window.pageYOffset
      const height = window.innerHeight
      const mobile = window.innerWidth < mediaQueries.mBreakPoint
      const { sticky, setSticky } = this.props

      if (!this.inner) {
        return
      }

      let status = false
      let sidebar = false
      if (y + HEADER_HEIGHT > this.y) {
        status = true
        if (
          !mobile &&
          height - HEADER_HEIGHT > this.innerHeight &&
          height >= minWindowHeight
        ) {
          sidebar = true
        }
      }

      if (sticky.status !== status || sticky.sidebar !== sidebar) {
        setSticky({
          status,
          sidebar
        })
      }
    }
    this.innerRef = ref => {
      this.inner = ref
    }
    this.measure = () => {
      if (this.inner) {
        const rect = this.inner.getBoundingClientRect()

        this.y = window.pageYOffset + rect.top
        this.innerHeight = rect.height

        const right = window.innerWidth - rect.right

        if (right !== this.state.right) {
          this.setState(() => ({
            right
          }))
        }
      }
      this.onScroll()
    }
  }
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)
    this.measure()
  }
  componentDidUpdate() {
    this.measure()
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }
  render() {
    const { right } = this.state
    const {
      sticky,
      t,
      crowdfunding,
      primaryParams,
      title,
      links,
      packages,
      statusProps,
      inNativeIOSApp
    } = this.props

    const onChange = state => this.setState(() => state)

    if (!crowdfunding) {
      return null
    }

    return (
      <div>
        <RawStatus
          people
          money
          t={t}
          crowdfundingName={crowdfunding.name}
          crowdfunding={crowdfunding}
          {...statusProps}
        />

        {!inNativeIOSApp && (
          <>
            <div
              ref={this.innerRef}
              style={{
                visibility: sticky.sidebar ? 'hidden' : 'visible'
              }}
            >
              <SidebarInner
                title={title}
                links={links}
                packages={packages}
                primaryParams={primaryParams}
                t={t}
                crowdfunding={crowdfunding}
                onChange={onChange}
                state={this.state}
              />
            </div>

            {!!sticky.sidebar && (
              <div {...styles.sticky} style={{ right: right }}>
                <SidebarInner
                  title={title}
                  links={links}
                  packages={packages}
                  primaryParams={primaryParams}
                  t={t}
                  crowdfunding={crowdfunding}
                  onChange={onChange}
                  state={this.state}
                />
              </div>
            )}
          </>
        )}
      </div>
    )
  }
}

export default compose(
  withInNativeApp,
  withStatus,
  withT
)(Sidebar)
