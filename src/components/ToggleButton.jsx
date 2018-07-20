import React, { Component, PropTypes } from 'react'

export default class ToggleButton extends Component {
  render() {
    const {
      display,
      title,
      onClickFunc,
      modelId,
      classActive,
      classInactive
    } = this.props

    let buttonClass = ''
    if (display) {
      buttonClass = classActive
    } else {
      buttonClass = classInactive
    }

    return (
      <button className={buttonClass} onClick={onClickFunc.bind(null, modelId)}>
        {title}
      </button>
    )
  }
}

ToggleButton.propTypes = {
  display: PropTypes.number,
  title: PropTypes.string,
  onClickFunc: PropTypes.func,
  modelId: PropTypes.string,
  classActive: PropTypes.string,
  classInactive: PropTypes.string
}

ToggleButton.defaultProps = {
  display: 0,
  title: 'ToggleButton',
  modelId: 'ToggleButton',
  classActive:
    'type-button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary',
  classInactive:
    'type-button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent'
}
