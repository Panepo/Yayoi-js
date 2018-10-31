import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import withRoot from '../withRoot'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import MenuIcon from '@material-ui/icons/Menu'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { listLink } from '../constants/ConstLink'

const styles = theme => ({
  root: {},
  appBar: {
    position: 'relative'
  },
  button: {
    margin: theme.spacing.unit
  },
  grow: {
    flexGrow: 1
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  }
})

class Header extends React.Component {
  renderLink = () => {
    const { classes } = this.props

    return listLink.reduce((output, data, i) => {
      output.push(
        <Button color="primary" className={classes.button} href={data.link}>
          {data.text}
        </Button>
      )
      return output
    }, [])
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <AppBar position="static" color="inherit" className={classes.appBar}>
          <Toolbar>
            <MenuIcon className={classes.icon} color="primary" />
            <Typography
              variant="h6"
              color="inherit"
              className={classes.grow}
              noWrap>
              Yayoi
            </Typography>
            {this.renderLink()}
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRoot(withStyles(styles)(Header))
