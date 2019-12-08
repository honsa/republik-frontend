import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'

import { CDN_FRONTEND_BASE_URL, PUBLIC_BASE_URL } from '../lib/constants'
import withT, { t } from '../lib/withT'

import { enforceMembership } from '../components/Auth/withMembership'
import {
  withQuestionnaire,
  withQuestionnaireMutation,
  withQuestionnaireReset
} from '../components/Questionnaire/enhancers'
import { description } from './questionnaire'
import { withRouter } from 'next/router'
import QuestionnaireActions from '../components/Questionnaire/QuestionnaireActions'
import Frame from '../components/Frame'
import Questionnaire from '../components/Questionnaire/Questionnaire'
import {
  userDetailsFragment,
  withMyDetails
} from '../components/Account/enhancers'
import { errorToString } from '../lib/utils/errors'
import {
  DEFAULT_COUNTRY,
  isEmptyAddress
} from '../components/Account/AddressForm'
import FieldSet from '../components/FieldSet'
import gql from 'graphql-tag'
import DetailsForm from '../components/Account/DetailsForm'
import {
  Interaction,
  RawHtml,
  colors,
  Figure,
  FigureImage
} from '@project-r/styleguide'
import { css } from 'glamor'
import MdArrow from 'react-icons/lib/md/trending-flat'
import ShareButtons from '../components/ActionBar/ShareButtons'

const { Headline, P } = Interaction

const mutation = gql`
  mutation submitQuestionnaireAndUpdateMe(
    $questionnaireId: ID!
    $phoneNumber: String
    $address: AddressInput
  ) {
    updateMe(phoneNumber: $phoneNumber, address: $address) {
      id
      ...PhoneAndAddressOnUser
    }
    submitQuestionnaire(id: $questionnaireId) {
      id
      userSubmitDate
      userHasSubmitted
    }
  }
  ${userDetailsFragment}
`

const withMutation = graphql(mutation, {
  props: ({ mutate }) => ({
    submitForm: variables =>
      mutate({
        variables
      })
  })
})

const meta = {
  title: t('questionnaire/crowd/title'),
  description: t('questionnaire/crowd/description'),
  image: `${CDN_FRONTEND_BASE_URL}/static/social-media/logo.png`,
  facebookTitle: t('pages/meta/questionnaire/crowd/socialTitle'),
  twitterTitle: t('pages/meta/questionnaire/crowd/socialTitle')
}

const gifLink = `${CDN_FRONTEND_BASE_URL}/static/social-media/umfrage/crowd/schade.gif`

const styles = {
  intro: css({
    margin: '35px 0 70px'
  }),
  arrow: css({
    marginRight: 15,
    minWidth: 16,
    color: colors.lightText
  }),
  thankYouItem: css({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'center',
    marginBottom: 20
  }),
  socialButtons: css({
    marginLeft: 30,
    marginTop: 30
  })
}

const getValues = me => {
  let addressState = {}
  if (me.address) {
    addressState = {
      name: me.address.name || me.name,
      line1: me.address.line1,
      line2: me.address.line2,
      postalCode: me.address.postalCode,
      city: me.address.city,
      country: me.address.country
    }
  } else if (me) {
    addressState.name = [me.firstName, me.lastName].filter(Boolean).join(' ')
    addressState.country = DEFAULT_COUNTRY
  }

  return {
    phoneNumber: me.phoneNumber || '',
    ...addressState
  }
}

const getMutation = (values, me) => {
  return {
    phoneNumber: values.phoneNumber,
    address: isEmptyAddress(values, me)
      ? undefined
      : {
          name: values.name,
          line1: values.line1,
          line2: values.line2,
          postalCode: values.postalCode,
          city: values.city,
          country: values.country
        }
  }
}

const getWillingnessToHelp = questions => {
  if (!questions || !questions.length) return

  const answer1 = questions[0].userAnswer
  return answer1 && answer1.payload.value[0]
}

const adaptedQuestionnaire = (data, notConvinced) => {
  if (data && data.questionnaire) {
    data.questionnaire.questions[0].text = notConvinced
      ? t('questionnaire/crowd/question1/alt')
      : t('questionnaire/crowd/question1')
  }
  return data
}

const ThankYouItem = compose(withT)(({ t, tKey }) => {
  return (
    <div {...styles.thankYouItem}>
      <MdArrow {...styles.arrow} />
      <RawHtml
        type={P}
        dangerouslySetInnerHTML={{
          __html: t(tKey)
        }}
      />
    </div>
  )
})

const ThankYou = compose(withT)(({ t }) => {
  return (
    <div>
      <Headline>{t('questionnaire/crowd/submitted/title')}</Headline>
      <div {...styles.intro}>
        <P>{t('questionnaire/crowd/submitted/intro')}</P>
      </div>
      <div>
        <ThankYouItem tKey='questionnaire/crowd/submitted/list/1' />
        <ThankYouItem tKey='questionnaire/crowd/submitted/list/2' />
      </div>
    </div>
  )
})

const NoThanks = compose(withT)(({ t }) => {
  return (
    <div>
      <Headline>{t('questionnaire/crowd/submitted/title')}</Headline>
      <div {...styles.intro}>
        <RawHtml
          type={P}
          dangerouslySetInnerHTML={{
            __html: t('questionnaire/crowd/submitted/declined/intro')
          }}
        />
      </div>
    </div>
  )
})

const initState = {
  willingnessStatus: undefined,
  notConvinced: false,
  showErrors: false,
  values: {},
  errors: {},
  dirty: {}
}

class QuestionnaireCrowdPage extends Component {
  constructor(props) {
    super(props)
    this.state = initState
  }

  onDetailsChange(fields) {
    this.setState(FieldSet.utils.mergeFields(fields))
  }

  onQuestionnaireChange() {
    const {
      questionnaireData: { questionnaire }
    } = this.props

    const willingness = getWillingnessToHelp(questionnaire.questions)
    const isWilling = willingness === 'true'
    this.setState({
      willingnessStatus: willingness,
      notConvinced: !isWilling,
      showErrors: isWilling ? this.state.showErrors : false,
      errors: isWilling ? this.state.errors : {},
      dirty: isWilling ? this.state.dirty : {}
    })
  }

  processErrors(errorMessages) {
    if (errorMessages.length) {
      this.setState(state =>
        Object.keys(state.errors).reduce(
          (nextState, key) => {
            nextState.dirty[key] = true
            return nextState
          },
          {
            showErrors: true,
            dirty: {}
          }
        )
      )
      return true
    }
  }

  processSubmit() {
    const {
      detailsData: { me },
      submitForm,
      submitQuestionnaire,
      questionnaireData: {
        questionnaire: { id }
      }
    } = this.props

    const { values, willingnessStatus } = this.state

    return willingnessStatus === 'true'
      ? submitForm({ ...getMutation(values, me), questionnaireId: id })
      : submitQuestionnaire(id)
  }

  submit(errorMessages) {
    const hasErrors = this.processErrors(errorMessages)
    if (hasErrors) return

    this.setState({ updating: true })
    this.processSubmit()
      .then(() =>
        this.setState(() => ({
          updating: false,
          serverError: null
        }))
      )
      .catch(error => {
        this.setState(() => ({
          updating: false,
          submitting: false,
          serverError: errorToString(error)
        }))
      })
      .then(() => window.scrollTo(0, 0))
  }

  reset() {
    const {
      resetQuestionnaire,
      questionnaireData: {
        questionnaire: { id }
      },
      detailsData: { me }
    } = this.props

    resetQuestionnaire(id).then(() =>
      this.setState({
        ...initState,
        values: getValues(me)
      })
    )
  }

  init() {
    const { questionnaireData, detailsData } = this.props
    if (
      questionnaireData &&
      questionnaireData.questionnaire &&
      detailsData &&
      detailsData.me &&
      !this.initialised
    ) {
      this.initialised = true
      this.setState(() => ({
        willingnessStatus: getWillingnessToHelp(
          questionnaireData.questionnaire.questions
        ),
        values: getValues(detailsData.me)
      }))
    }
  }

  componentDidMount() {
    this.init()
  }
  componentDidUpdate() {
    this.init()
  }

  render() {
    const { detailsData, questionnaireData, router } = this.props
    const {
      serverError,
      updating,
      submitting,
      values,
      dirty,
      errors,
      showErrors,
      willingnessStatus,
      notConvinced
    } = this.state

    const submitted =
      questionnaireData &&
      questionnaireData.questionnaire &&
      questionnaireData.questionnaire.userHasSubmitted

    const slug = router.query.slug

    const errorMessages =
      errors &&
      Object.keys(errors)
        .map(key => errors[key])
        .filter(Boolean)

    const willingToHelp = willingnessStatus === 'true'
    const thankYou =
      !willingnessStatus || willingToHelp ? <ThankYou /> : <NoThanks />

    return (
      <Frame meta={meta}>
        <Questionnaire
          questionnaireData={adaptedQuestionnaire(
            questionnaireData,
            notConvinced
          )}
          externalSubmit
          hideCount
          questionnaireName='crowd'
          pageClosed={thankYou}
          error={serverError}
          updating={updating}
          submitting={submitting}
          sliceAt={1}
          showSlice2={willingToHelp}
          onQuestionnaireChange={() => this.onQuestionnaireChange()}
        />
        {!submitted && willingnessStatus && (
          <>
            {willingToHelp ? (
              <DetailsForm
                style={{ marginTop: 50 }}
                data={detailsData}
                values={values}
                errors={errors}
                dirty={dirty}
                onChange={fields => this.onDetailsChange(fields)}
                errorMessages={errorMessages}
                showErrors={!updating && !!showErrors}
              />
            ) : (
              <Figure>
                <FigureImage src={gifLink} maxWidth={500} alt='Schade' />
              </Figure>
            )}
            <QuestionnaireActions
              onSubmit={() => {
                this.submit(errorMessages)
              }}
              onReset={() => this.reset()}
              updating={updating}
              submitting={submitting}
              leftAlign
            />
          </>
        )}
      </Frame>
    )
  }
}

export default compose(
  withRouter,
  withQuestionnaire,
  withMyDetails,
  withMutation,
  withQuestionnaireMutation,
  withQuestionnaireReset,
  enforceMembership(meta, { title: t('questionnaire/title'), description })
)(QuestionnaireCrowdPage)
