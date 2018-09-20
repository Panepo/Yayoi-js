import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { iframeSwitch } from '../actions'
import './IframeCover.css'

class IframeCover extends Component {
  constructor(props) {
    super(props)
    this.handleSwitch = this.handleSwitch.bind(this)
  }

  handleSwitch = () => {
    const { iframeSwitch } = this.props
    iframeSwitch(false)
  }

  render() {
    const { iframeDisplay } = this.props

    if (iframeDisplay) {
      return (
        <div className="iframe_cover">
          <button
            className="iframe_close mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect"
            onClick={this.handleSwitch}>
            <div className="material-icons">clear</div>
          </button>
          <div className="iframe_content mdl-color--black">
            <iframe
              title="nonsense"
              className="iframe_nonsense"
              src="https://svenstaro.github.io/genact/"
            />
          </div>
        </div>
      )
    }
    return null
  }
}

IframeCover.propTypes = {
  iframeDisplay: PropTypes.bool.isRequired,
  iframeSwitch: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    iframeDisplay: state.reducerLayout.iframeDisplay
  }
}

const mapDispatchToProps = dispatch => {
  return {
    iframeSwitch: bindActionCreators(iframeSwitch, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IframeCover)
