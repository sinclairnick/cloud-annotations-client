import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import TitleBar from './TitleBar'
import App from './App'
import Buckets from './Buckets'

class Routing extends Component {
  render() {
    return (
      <div>
        <TitleBar />
        <Router>
          <Switch>
            {/* With `Switch` there will only ever be one child here */}
            <Route exact path="/" component={Buckets} />
            <Route path="/:bucket" component={App} />
          </Switch>
        </Router>
      </div>
    )
  }
}

export default Routing