import React from 'react'
import PropTypes from 'prop-types'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import { withStyles } from '@material-ui/core/styles'
import withRoot from '../withRoot'

const styles = theme => ({
  root: {},
  textLabel: {
    color: '#9C27B0'
  },
  textFocused: {},
  textUnderline: {
    '&:before': {
      borderBottomColor: '#E0E0E0'
    },
    '&:focus': {
      borderBottomColor: '#9C27B0'
    }
  }
})

class MucText extends React.Component {
  render() {
    const { classes, modelId, modelLabel, modelValue } = this.props

    return (
      <FormControl id={modelId} className={classes.root}>
        <InputLabel
          htmlFor={modelId}
          FormLabelClasses={{
            root: classes.textLabel,
            focused: classes.textFocused
          }}>
          {modelLabel}
        </InputLabel>
        <Input
          id={modelId}
          classes={{
            underline: classes.textUnderline
          }}
          value={modelValue}
          readOnly
        />
      </FormControl>
    )
  }
}

MucText.propTypes = {
  classes: PropTypes.object.isRequired,
  modelId: PropTypes.string,
  modelLabel: PropTypes.string,
  modelValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

MucText.defaultProps = {
  modelId: 'MucText',
  modelLabel: 'MucText',
  modelValue: 'MucText'
}

export default withRoot(withStyles(styles)(MucText))
