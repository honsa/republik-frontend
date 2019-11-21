import React from 'react'
import { compose } from 'react-apollo'
import Router, { withRouter } from 'next/router'
import { FILTER_KEY_PARAM, FILTER_VALUE_PARAM, QUERY_PARAM } from './constants'

export default WrappedComponent =>
  compose(withRouter)(({ router: { query }, ...props }) => {
    const searchQuery = query[QUERY_PARAM]
    const filter = query[FILTER_KEY_PARAM] && {
      key: query[FILTER_KEY_PARAM],
      value: query[FILTER_VALUE_PARAM]
    }

    const updateURL = newParams => {
      Router.push({
        pathname: '/suche',
        query: {
          ...query,
          ...newParams
        }
      })
    }
    const onSearchQueryChange = q => {
      console.log('submit', q)
      updateURL({ [QUERY_PARAM]: q })
    }
    const onFilterChange = filter =>
      updateURL({
        [FILTER_KEY_PARAM]: filter.key,
        [FILTER_VALUE_PARAM]: filter.value
      })

    const resetURL = () => {
      console.log('reset')
      Router.push({ pathname: '/suche' })
    }

    return (
      <WrappedComponent
        searchQuery={searchQuery}
        filter={filter}
        onSearchQueryChange={onSearchQueryChange}
        onFilterChange={onFilterChange}
        resetURL={resetURL}
        {...props}
      />
    )
  })
