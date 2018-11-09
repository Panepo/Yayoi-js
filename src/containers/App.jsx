import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import MucRibbon from '../componments/MucRibbon'
import Content from './Content'
import Footer from './Footer'
import { withStyles } from '@material-ui/core/styles'
import withRoot from '../withRoot'

const styles = theme => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column'
  }
})

class App extends React.Component {
  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Header />
          <MucRibbon />
          <Content />
          <Footer />
        </div>
      </React.Fragment>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRoot(withStyles(styles)(App))
