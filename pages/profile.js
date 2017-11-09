import React from 'react'
import {compose} from 'redux'
import Frame from '../components/Frame'
import Nav from '../components/Nav'
import Profile from '../components/Profile'
import Marketing from '../components/Marketing'
import withData from '../lib/apollo/withData'
import withMe from '../lib/apollo/withMe'
import withT from '../lib/withT'

const Index = ({ url, me, t }) => {
  return (
    <Frame url={url} nav={<Nav route='' url={url} />}>
      {me ? <Profile userId={url.query.userId} /> : <Marketing />}
    </Frame>
  )
}

export default compose(
  withData,
  withMe,
  withT
)(Index)