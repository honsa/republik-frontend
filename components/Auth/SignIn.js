import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import isEmail from 'validator/lib/isEmail'

import { Link } from '../../lib/routes'
import withT from '../../lib/withT'
import { meQuery } from '../../lib/apollo/withMe'

import ErrorMessage from '../ErrorMessage'

import {
  Button,
  InlineSpinner,
  Interaction,
  Field,
  RawHtml,
  colors,
  Editorial
} from '@project-r/styleguide'

import Poller from './Poller'
import EmailForm, { checkEmail } from './EmailForm'

class SignIn extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...checkEmail({
        value: props.email || '',
        t: props.t
      }),
      polling: false,
      loading: false,
      success: undefined
    }

    this.onFormSubmit = event => {
      event.preventDefault()
      this.signIn()
    }

    this.signIn = tokenType => {
      const { loading, error, email } = this.state
      const { signIn, context, acceptedConsents } = this.props

      if (error) {
        this.setState(() => ({ dirty: true }))
        return
      }

      if (loading) {
        return
      }

      this.setState(() => ({ loading: true }))

      signIn(email, context, acceptedConsents, tokenType)
        .then(({ data }) => {
          this.setState(() => ({
            polling: true,
            loading: false,
            phrase: data.signIn.phrase,
            tokenType: data.signIn.tokenType,
            alternativeFirstFactors: data.signIn.alternativeFirstFactors
          }))
        })
        .catch(error => {
          this.setState(() => ({
            serverError: error,
            loading: false
          }))
        })
    }
  }

  componentDidMount() {
    this.setState({ cookiesDisabled: !navigator.cookieEnabled })
  }

  componentWillUnmount() {
    if (this.state.polling) {
      const data = this.props.client.readQuery({ query: meQuery })
      if (data.me) {
        this.reloadOnSuccess()
      }
    }
  }

  reloadOnSuccess() {
    const { context, noReload } = this.props
    // only immediately reload if not in a context like faq or purchase
    if (!context && !noReload) {
      // re-load after sign in
      // - clear apollo cache
      // - re-establish ws conntection with cookie
      window.location.reload()
    }
  }

  render() {
    const { t, label, beforeForm } = this.props
    const {
      phrase,
      tokenType,
      alternativeFirstFactors,
      polling,
      loading,
      success,
      error,
      dirty,
      email,
      serverError
    } = this.state

    if (polling) {
      return loading ? (
        <InlineSpinner size={26} />
      ) : (
        <Poller
          tokenType={tokenType}
          phrase={phrase}
          email={email}
          alternativeFirstFactors={alternativeFirstFactors}
          onCancel={() => {
            this.setState(() => ({
              polling: false
            }))
          }}
          onTokenTypeChange={altTokenType => {
            this.signIn(altTokenType)
          }}
          onSuccess={me => {
            this.setState(() => ({
              polling: false,
              success: t('signIn/success', {
                nameOrEmail: me.name || me.email
              })
            }))
            this.reloadOnSuccess()
          }}
        />
      )
    }
    if (success) {
      return <span>{success}</span>
    }

    if (this.state.cookiesDisabled) {
      return (
        <Fragment>
          <ErrorMessage error={t('cookies/disabled/error')} />
          <RawHtml
            type={Interaction.P}
            dangerouslySetInnerHTML={{
              __html: t('cookies/disabled/error/explanation')
            }}
          />
        </Fragment>
      )
    }

    return (
      <EmailForm
        beforeForm={beforeForm}
        label={label}
        email={email}
        dirty={dirty}
        error={error}
        onChange={state => this.setState(state)}
        onSubmit={this.onFormSubmit}
        loading={loading}
        serverError={serverError}
        hints={
          <>
            <Link route='legal/privacy' passHref>
              <Editorial.A>{t('signIn/privacy')}</Editorial.A>
            </Link>
            {' – '}
            <Link route='faq' passHref>
              <Editorial.A>{t('signIn/faq')}</Editorial.A>
            </Link>
            {' – '}
            {t('signIn/hint')}
          </>
        }
      />
    )
  }
}

SignIn.propTypes = {
  signIn: PropTypes.func.isRequired,
  noReload: PropTypes.bool
}

const signInMutation = gql`
  mutation signIn(
    $email: String!
    $context: String
    $consents: [String!]
    $tokenType: SignInTokenType
    $accessToken: ID
  ) {
    signIn(
      email: $email
      context: $context
      consents: $consents
      tokenType: $tokenType
      accessToken: $accessToken
    ) {
      phrase
      tokenType
      alternativeFirstFactors
    }
  }
`

export const withSignIn = graphql(signInMutation, {
  props: ({ mutate }) => ({
    signIn: (email, context = 'signIn', consents, tokenType, accessToken) =>
      mutate({
        variables: { email, context, consents, tokenType, accessToken }
      })
  })
})

export default compose(withApollo, withSignIn, withT)(SignIn)
