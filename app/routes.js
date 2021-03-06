/**
 * These are the pages that you can navigate to.
 * They are all wrapped in the App component, which should contain the navbar/footer/etc
 *
 * Code splitting example inspired by:
 * https://gist.github.com/acdlite/a68433004f9d6b4cbc83b5cc3990c194
 */
import React from 'react'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Route, Switch } from 'react-router-dom'
import { connectedReduxRedirect } from 'redux-auth-wrapper/history3/redirect'

import App from 'containers/App'
import appComponents from './routeAsyncComponents'
import { loginRequest } from 'auth/actions'

const userIsAuthenticated = connectedReduxRedirect({
  // URL to redirect user to if they are not authenticated
  redirectPath: '/login',
  // Determine if the user is authenticted or not
  authenticatedSelector: state => state.get('auth').toJS().idToken !== null,
  // Display name for this check
  wrapperDisplayName: 'UserIsAuthenticated',
  // Call LOGIN_REQUEST on redirect
  redirectAction: loginRequest
})

const RouteConfig = (props) => {
  // Get async components for routing
  const components = appComponents(props.store)

  // Return a Route component for Router
  const RouteWithSubRoutes = (route) => (
    <Route exact={route.exact} path={route.path} render={props => (
      <route.component {...props} routes={route.routes} />
    )} />
  )

  // Define route paths
  const routes = [{
    exact: true,
    path: '/',
    component: components.HomePage
  }, {
    path: '/features',
    component: components.FeaturePage
  }, {
    path: '/dashboard',
    component: userIsAuthenticated(components.Dashboard)
  }, {
    path: '*',
    component: components.NotFoundPage
  }]

  // Return the configured Router
  return (
    <Router history={props.history}>
      <App>
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </Switch>
      </App>
    </Router>
  )
}

export default RouteConfig
