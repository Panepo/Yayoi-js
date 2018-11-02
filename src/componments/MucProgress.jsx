import React from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import withRoot from '../withRoot'

const styles = theme => ({
  root: {}
})

class MucProgress extends React.Component {
  renderBorder = renderSwitch => {
    if (renderSwitch) {
      return <Divider />
    }
  }

  render() {
    const {
      classes,
      modelId,
      modelBorderUp,
      modelBorderDown,
      modelSwitch,
      modelText
    } = this.props

    if (modelSwitch) {
      return (
        <div className={classes.root} id={modelId}>
          {this.renderBorder(modelBorderUp)}
          <Typography>{modelText}</Typography>
          <LinearProgress />
          {this.renderBorder(modelBorderDown)}
        </div>
      )
    } else {
      return null
    }
  }
}

MucProgress.propTypes = {
  classes: PropTypes.object.isRequired,
  modelId: PropTypes.string,
  modelBorderUp: PropTypes.bool,
  modelBorderDown: PropTypes.bool,
  modelSwitch: PropTypes.bool,
  modelText: PropTypes.string
}

MucProgress.defaultProps = {
  modelId: 'MucProgress',
  modelClass: 'MucProgress',
  modelBorderUp: false,
  modelBorderDown: false,
  modelSwitch: true,
  modelText: 'MucProgress'
}

export default withRoot(withStyles(styles)(MucProgress))
