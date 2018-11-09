import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import withRoot from '../withRoot'

const styles = theme => ({
  root: {
    background: '#424242',
    height: '60px',
    width: '100%'
  },
  text: {
    color: '#BDBDBD',
    fontSize: '13px',
    paddingLeft: '40px',
    paddingTop: '20px'
  }
})

class Footer extends React.Component {
  render() {
    const { classes } = this.props

    return (
      <footer className={classes.root}>
        <Typography className={classes.text}>
          Copyright &copy; Panepo@Github 2018 All Rights Reserved.
        </Typography>
      </footer>
    )
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRoot(withStyles(styles)(Footer))
