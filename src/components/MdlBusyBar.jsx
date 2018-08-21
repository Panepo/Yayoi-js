import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './MdlBusyBar.css'

export default class MdlBusyBar extends Component {
  componentDidUpdate = () => {
    window.componentHandler.upgradeDom()
  }

  renderBorder = renderSwitch => {
    if (renderSwitch) {
      return (
        <div className="mdl-card__actions mdl-card--border mdlBusyBar_border" />
      )
    }
  }

  render() {
    const {
      modelId,
      modelClass,
      modelBorderUp,
      modelBorderDown,
      modelSwitch,
      modelText
    } = this.props
    let outputClass = modelClass + ' mdl-typography--subhead'

    if (modelSwitch) {
      return (
        <div className={outputClass} id={modelId}>
          {this.renderBorder(modelBorderUp)}
          <span>{modelText}</span>
          <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate" />
          {this.renderBorder(modelBorderDown)}
        </div>
      )
    } else {
      return null
    }
  }
}

MdlBusyBar.propTypes = {
  modelId: PropTypes.string,
  modelClass: PropTypes.string,
  modelBorderUp: PropTypes.bool,
  modelBorderDown: PropTypes.bool,
  modelSwitch: PropTypes.bool,
  modelText: PropTypes.string
}

MdlBusyBar.defaultProps = {
  modelId: 'MdlBusyBar',
  modelClass: 'MdlBusyBar',
  modelBorderUp: false,
  modelBorderDown: false,
  modelSwitch: true,
  modelText: 'MdlBusyBar'
}
