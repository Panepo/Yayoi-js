import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Webcam from 'react-webcam'

export default class WebCamPlayer extends Component {
  constructor(props) {
    super(props)
    this.state = { isPlaying: false }
    this.handleControl = this.handleControl.bind(this)
  }

  setRef = webcam => {
    this.webcam = webcam
  }

  handleControl = () => {
    if (this.state.isPlaying === true) {
      this.setState({ isPlaying: false })
    } else {
      this.setState({ isPlaying: true })
    }
  }

  render() {
    const { modelId, canvasWidth, canvasHeight } = this.props
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: 'user'
    }

    if (this.state.isPlaying) {
      return (
        <div key={modelId}>
          <div>
            <button
              className="imageUploader_Button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary"
              onClick={this.handleControl}
            >
              Webcam Stop
            </button>
          </div>
          <div className="mdl-card__actions mdl-card--border imageUploader_border" />
          <div>
            <Webcam
              audio={false}
              width={canvasWidth}
              height={canvasHeight}
              ref={this.setRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div key={modelId}>
          <button
            className="imageUploader_Button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary"
            onClick={this.handleControl}
          >
            Webcam Start
          </button>
        </div>
      )
    }
  }
}

WebCamPlayer.propTypes = {
  modelId: PropTypes.string,
  canvasWidth: PropTypes.number,
  canvasHeight: PropTypes.number
}

WebCamPlayer.defaultProps = {
  modelId: 'WebCamPlayer',
  canvasWidth: 640,
  canvasHeight: 480
}
