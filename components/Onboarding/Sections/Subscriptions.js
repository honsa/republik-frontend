import React from 'react'
import gql from 'graphql-tag'
import { css } from 'glamor'

import Section from '../Section'
import { Link } from '../../../lib/routes'
import withT from '../../../lib/withT'

import { Interaction, linkRule } from '@project-r/styleguide'
import { subInfo } from '../../Notifications/enhancers'
import SubscribeDocumentCheckbox from '../../Notifications/SubscribeDocumentCheckbox'

const { P } = Interaction

const styles = {
  p: css({
    marginBottom: 20
  })
}

export const fragments = {
  formats: gql`
    fragment FormatInfo on Document {
      id
      meta {
        title
      }
      subscribedByMe {
        ...subInfo
      }
    }
    ${subInfo}
  `
}

const Subscriptions = props => {
  const { sections, t } = props

  const formats = sections.reduce(
    (reducer, section) => reducer.concat(section.linkedDocuments.nodes),
    []
  )
  const isTicked = formats.some(
    format => format.subscribedByMe && format.subscribedByMe.active
  )

  return (
    <Section
      heading={t('Onboarding/Sections/Subscriptions/heading')}
      isTicked={isTicked}
      {...props}
    >
      <P {...styles.p}>{t('Onboarding/Sections/Subscriptions/preamble')}</P>
      <div style={{ margin: '20px 0' }}>
        {formats.map((format, i) => (
          <SubscribeDocumentCheckbox
            subscription={format.subscribedByMe}
            format={format}
            key={i}
          />
        ))}
      </div>
      <P {...styles.p}>
        {t.elements('Onboarding/Sections/Subscriptions/hint', {
          link: (
            <Link key='link' route='subscriptions' passHref>
              <a {...linkRule}>
                {t('Onboarding/Sections/Subscriptions/hint/link')}
              </a>
            </Link>
          )
        })}
      </P>
    </Section>
  )
}

export default withT(Subscriptions)
