import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import withRoot from '../withRoot'

const styles = theme => ({
  root: {
    width: '100%',
    height: '60vh',
    background: 'linear-gradient(165deg, #3333ff 20%, #ffccff 90%)'
  }
})

class MucRibbon extends React.Component {
  render() {
    const { classes } = this.props
    return <div className={classes.root} />
  }
}

MucRibbon.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRoot(withStyles(styles)(MucRibbon))
