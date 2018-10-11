import React, { Component } from 'react'
import { css } from 'glamor'
import { Body, Heading, Section, Small, Title } from './text'
import Collapsible from './Collapsible'
import Voting from './Voting'
import Election from './Election'
import { mediaQueries } from '@project-r/styleguide'
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '../constants'
import voteT from './voteT'

import { ELECTION_COOP_MEMBERS_SLUG, ELECTION_COOP_PRESIDENT_SLUG } from '../../lib/constants'

const styles = {
  anchor: css({
    display: 'block',
    position: 'relative',
    visibility: 'hidden',
    top: -HEADER_HEIGHT_MOBILE,
    [mediaQueries.lUp]: {
      top: -HEADER_HEIGHT
    }
  })
}

class VoteForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      president: []
    }

    this.onVoteChange = (field) => (value) => {
      this.setState({ [field]: value })
    }
  }

  render () {
    const { vt } = this.props

    return (
      <div style={{ marginTop: 0 }}>
        <Section>
          <Title>{vt('vote/title')}</Title>
          <Body dangerousHTML={vt('vote/intro/body')} />
          <Collapsible>
            <Small dangerousHTML={vt('vote/intro/more')} />
          </Collapsible>
        </Section>
        <Section>
          <a {...styles.anchor} id='jahresrechnung' />
          <Heading>Jahresrechnung</Heading>
          <Body dangerousHTML={vt('vote/jahresrechnung/body')} />
          <Collapsible>
            <Small dangerousHTML={vt('vote/jahresrechnung/more')} />
          </Collapsible>
          <Voting
            slug='gen18accounts'
          />
        </Section>

        <Section>
          <a {...styles.anchor} id='revisionsbericht' />
          <Heading>Revisionsbericht</Heading>
          <Body dangerousHTML={vt('vote/revisionsbericht/body')} />
          <Collapsible>
            <Small dangerousHTML={vt('vote/revisionsbericht/more')} />
          </Collapsible>
          <Voting
            slug='gen18revision'
          />
        </Section>

        <Section>
          <a {...styles.anchor} id='budget' />
          <Heading>Budget</Heading>
          <Body dangerousHTML={vt('vote/budget/body')} />
          <Collapsible>
            <Small dangerousHTML={vt('vote/budget/more')} />
          </Collapsible>
          <Voting
            slug='gen18budget'
          />
        </Section>

        <Section>
          <a {...styles.anchor} id='president' />
          <Heading>Präsidium</Heading>
          <Body dangerousHTML={vt('vote/president/body')} />
          <Collapsible>
            <Small dangerousHTML={vt('vote/president/more')} />
          </Collapsible>
          <Election
            slug={ELECTION_COOP_PRESIDENT_SLUG}
            onChange={this.onVoteChange('president')}
          />
        </Section>

        <Section>
          <a {...styles.anchor} id='genossenschaftsrat' />
          <Heading>Genossenschaftsrat</Heading>
          <Body dangerousHTML={vt('vote/members/body')} />
          <Collapsible>
            <Small dangerousHTML={vt('vote/members/more')} />
          </Collapsible>
          <Election
            slug={ELECTION_COOP_MEMBERS_SLUG}
            isSticky
            mandatoryCandidates={this.state.president}
          />
        </Section>
      </div>
    )
  }
}

export default voteT(VoteForm)
