import React from 'react'
import { css } from 'glamor'

import { Link } from '../../lib/routes'
import ActionBar from '../ActionBar'

import { PUBLIC_BASE_URL, ASSETS_SERVER_BASE_URL } from '../../lib/constants'

import {
  Interaction,
  fontFamilies,
  P as SerifP,
  colors,
  linkRule,
  VideoPlayer,
  mediaQueries,
  inQuotes,
  useColorContext
} from '@project-r/styleguide'

const { H3, P } = Interaction

const styles = {
  detail: css({
    width: '100%',
    padding: '30px 0',
    [mediaQueries.mUp]: {
      padding: '30px 45px'
    }
  }),
  detailTitle: css({
    lineHeight: '20px'
  }),
  detailRole: css({
    fontSize: 17,
    fontFamily: fontFamilies.sansSerifRegular
  }),
  number: css({
    marginBottom: 20,
    fontFamily: fontFamilies.sansSerifMedium
  })
}

const Detail = ({
  t,
  share,
  data: {
    id,
    slug,
    name,
    credentials,
    statement,
    portrait,
    sequenceNumber,
    video,
    updatedAt
  }
}) => {
  const [colorScheme] = useColorContext()
  return (
    <div {...styles.detail}>
      <div
        style={
          video
            ? {
                maxWidth: 400,
                marginLeft: 'auto',
                marginRight: 'auto'
              }
            : {}
        }
      >
        <H3 {...styles.detailTitle} style={{ color: colorScheme.text }}>
          {slug ? (
            <Link route='profile' params={{ slug }}>
              <a {...linkRule} style={{ color: 'inherit' }}>
                {name}
              </a>
            </Link>
          ) : (
            <span>{name}</span>
          )}{' '}
          <span {...styles.detailRole} style={{ color: colorScheme.lightText }}>
            {credentials && credentials[0] && credentials[0].description}
          </span>
        </H3>
        {video ? (
          <div
            style={{
              marginBottom: 20,
              marginTop: 10
            }}
          >
            <VideoPlayer
              key={id}
              src={{ ...video, poster: portrait }}
              autoPlay
            />
          </div>
        ) : statement ? (
          <SerifP style={{ color: colorScheme.text }}>
            {inQuotes(statement)}
          </SerifP>
        ) : (
          <br />
        )}
        {!!sequenceNumber && (
          <P {...styles.number} style={{ color: colorScheme.text }}>
            {t('memberships/sequenceNumber/label', {
              sequenceNumber
            })}
          </P>
        )}
        {share && (
          <ActionBar
            url={`${PUBLIC_BASE_URL}/community?id=${id}`}
            title={t('statement/share/title', {
              name
            })}
            emailSubject={t('statement/share/title', {
              name
            })}
            download={`${ASSETS_SERVER_BASE_URL}/render?width=1200&height=628&updatedAt=${encodeURIComponent(
              updatedAt
            )}&url=${encodeURIComponent(
              `${PUBLIC_BASE_URL}/community?share=${id}`
            )}`}
            shareOverlayTitle={t('statement/share/overlayTitle', {
              name
            })}
          />
        )}
      </div>
    </div>
  )
}

Detail.defaultProps = {
  share: true
}

export default Detail
