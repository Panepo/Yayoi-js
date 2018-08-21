import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { iframeSwitch } from '../actions'
import ImageGallery from '../components/ImageGallery'
import MdlBusyBar from '../components/MdlBusyBar'
import './Converter.css'

class Converter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isBusy: false,
      isPlaying: false,
      isTrained: false,
      isSensing: false,
      isAlarming: false,
      imageFile: [],
      imageWidth: 100,
      imageHeight: 100,
      imageSize: 1000000,
      imageFaceDesc: [],
      videoWidth: 640,
      videoHeight: 360,
      videoBuff: null,
      videoConstraints: {
        width: 1280,
        height: 720,
        facingMode: 'user'
      },
      processTime: '0',
      predictTick: 500,
      mtcnnParams: { minFaceSize: 50 },
      recogMinConf: 0.8
    }
    this.handleUpload = this.handleUpload.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handleTrain = this.handleTrain.bind(this)
    this.handleWebcam = this.handleWebcam.bind(this)
    this.handleIframe = this.handleIframe.bind(this)
  }

  // ================================================================================
  // React lifecycle functions
  // ================================================================================

  componentDidMount = async () => {
    await this.modelLoad()
    this.setState({ isLoading: false })
  }

  // ================================================================================
  // HTML functions
  // ================================================================================

  setWebcamRef = webcam => {
    this.webcam = webcam
  }

  // ================================================================================
  // DNN model functions
  // ================================================================================

  modelLoad = () => {
    return new Promise(async resolve => {
      resolve()
    })
  }

  modelTrain = () => {
    return new Promise(async resolve => {
      resolve()
    })
  }

  modelPredict = input => {
    return new Promise(async resolve => {
      resolve()
    })
  }

  // ================================================================================
  // React event handler functions
  // ================================================================================

  handleUpload = event => {
    const data = []
    const tstart = performance.now()
    clearInterval(this.interval)

    for (let i = 0; i < event.target.files.length; i += 1) {
      let dataTemp
      if (
        event.target.files[i] != null &&
        event.target.files[i].size <= this.state.imageSize
      ) {
        if (
          event.target.files[i].type === 'image/jpeg' ||
          event.target.files[i].type === 'image/png' ||
          event.target.files[i].type === 'image/bmp'
        ) {
          dataTemp = URL.createObjectURL(event.target.files[i])
          data.push(dataTemp)
        }
      }
    }

    const tend = performance.now()
    if (data.length > 0) {
      this.setState({
        imageFile: data,
        processTime: Math.floor(tend - tstart).toString() + ' ms',
        isSensing: false
      })
    } else {
      this.setState({
        imageFile: [],
        imageFaceDesc: [],
        isTrained: false,
        isSensing: false
      })
    }
  }

  handleClear = () => {
    clearInterval(this.interval)
    this.setState({
      imageFile: [],
      imageFaceDesc: [],
      isTrained: false,
      isSensing: false
    })
  }

  handleTrain = async () => {
    const tstart = performance.now()
    clearInterval(this.interval)
    this.setState({
      isBusy: true,
      imageFaceDesc: [],
      isTrained: false,
      isSensing: false
    })
    this.faceTrained = []
    await this.modelTrain()
    const tend = performance.now()
    this.setState({
      isBusy: false,
      isTrained: true,
      imageFaceDesc: this.faceTrained,
      processTime: Math.floor(tend - tstart).toString() + ' ms'
    })
  }

  handleWebcam = () => {
    if (this.state.isPlaying) {
      clearInterval(this.interval)
      this.setState({
        isPlaying: false,
        videoBuff: null,
        isSensing: false,
        isAlarming: false
      })
    } else {
      this.setState({ isPlaying: true })
    }
  }

  handleCapture = () => {
    return new Promise(async resolve => {
      await this.setState({ videoBuff: this.webcam.getScreenshot() })
      resolve()
    })
  }

  handleIframe = () => {
    const { iframeSwitch } = this.props
    iframeSwitch(true)
  }

  // ================================================================================
  // React render functions
  // ================================================================================

  renderButton = () => {
    const renderClear = () => {
      if (this.state.imageFile.length > 0) {
        return (
          <button
            className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary"
            onClick={this.handleClear}
          >
            Clear Image
          </button>
        )
      }
    }

    const renderTrain = () => {
      if (this.state.imageFile.length > 0) {
        return (
          <button
            className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary"
            onClick={this.handleTrain}
          >
            Train Network
          </button>
        )
      }
    }

    return (
      <div>
        <label className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary">
          Select Image
          <input
            className="sensor_button_none"
            type="file"
            onChange={this.handleUpload}
            required
            multiple
          />
        </label>
        {renderClear()}
        {renderTrain()}
      </div>
    )
  }

  renderProceeTime = () => {
    if (this.state.imageFile.length > 0 && this.state.isBusy === false) {
      return (
        <div>
          <div className="mdl-card__actions mdl-card--border sensor_borderline" />
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input
              className="mdl-textfield__input"
              type="text"
              id="processTime_text"
              readOnly
              value={this.state.processTime}
            />
            <label className="mdl-textfield__label" htmlFor="processTime_text">
              Process Time
            </label>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--4-col" />
          <div className="layout-content mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800 mdl-cell mdl-cell--4-col">
            <MdlBusyBar modelText={'Loading...'} />
            <img
              className="sensor_initial_black"
              id="initial_black"
              src="./black.png"
              alt="initial_black"
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className="layout-container mdl-grid">
          <div className="mdl-cell mdl-cell--1-col mdl-cell--hide-tablet mdl-cell--hide-phone" />
          <div className="layout-content mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800 mdl-cell mdl-cell--4-col">
            {this.renderButton()}
            <div className="mdl-card__actions mdl-card--border" />
            <ImageGallery
              imageSrc={this.state.imageFile}
              imageWidth={this.state.imageWidth}
              imageHeight={this.state.imageHeight}
              renderHidden
            />
            {this.renderProceeTime()}
            <MdlBusyBar
              modelSwitch={this.state.isBusy}
              modelText={'Processing...'}
              modelBorderUp
            />
          </div>
          <div className="layout-content mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800 mdl-cell mdl-cell--6-col" />
        </div>
      )
    }
  }
}

Converter.propTypes = {
  iframeSwitch: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    iframeSwitch: bindActionCreators(iframeSwitch, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Converter)
