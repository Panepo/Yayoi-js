import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { iframeSwitch } from '../actions'
import * as tf from '@tensorflow/tfjs'
import * as srcnn from './Srcnn'
import * as util from './Srcnn.util'
import MdlBusyBar from '../components/MdlBusyBar'
import './Converter.css'

class Converter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isBusy: false,
      imageFile: [],
      imageWidth: 200,
      imageHeight: 200,
      imageSize: 1000000,
      processTime: '0',
      scale: 2,
      modelPadding: 6,
      PredictSplit: false,
      imageSplitW: 5,
      imageSplitH: 5
    }
    this.handleUpload = this.handleUpload.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handlePredict = this.handlePredict.bind(this)
    this.handleIframe = this.handleIframe.bind(this)
    this.handleSplit = this.handleSplit.bind(this)
  }

  // ================================================================================
  // React lifecycle functions
  // ================================================================================

  componentDidMount = async () => {
    this.model = await tf.loadModel(srcnn.modelPath)
    await this.model.predict(tf.zeros([1, 32, 32, 1])).dispose()
    this.setState({ isLoading: false })
  }

  // ================================================================================
  // React event handler functions
  // ================================================================================

  handleUpload = event => {
    const data = []
    const tstart = performance.now()

    for (let i = 0; i < event.target.files.length; i += 1) {
      let dataTemp
      if (
        event.target.files[i] != null &&
        event.target.files[i].size <= this.state.imageSize
      ) {
        dataTemp = URL.createObjectURL(event.target.files[i])
        data.push(dataTemp)
      }
    }

    const tend = performance.now()
    if (data.length > 0) {
      this.setState({
        imageFile: data,
        processTime: Math.floor(tend - tstart).toString() + ' ms',
        isSensing: false
      })
      const image = document.getElementById('inputImage')
      const canvas = document.getElementById('inputCanvas')
      const ctx = canvas.getContext('2d')

      image.onload = () => {
        if (this.state.PredictSplit) {
          canvas.width = image.naturalWidth
          canvas.height = image.naturalHeight
          ctx.drawImage(image, 0, 0)
          this.setState({
            imageWidth: canvas.width,
            imageHeight: canvas.height,
            imageSplitW: Math.ceil(canvas.width / 100),
            imageSplitH: Math.ceil(canvas.height / 100)
          })
        } else {
          let [widthM, heightM] = util.limitWidthHeight(
            image.naturalWidth,
            image.naturalHeight,
            100
          )
          canvas.width = widthM
          canvas.height = heightM
          ctx.drawImage(
            image,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
            0,
            0,
            widthM,
            heightM
          )
          this.setState({
            imageWidth: canvas.width,
            imageHeight: canvas.height
          })
        }
      }
    } else {
      this.setState({
        imageFile: []
      })
    }
  }

  handleClear = () => {
    this.setState({
      imageFile: []
    })
    const canvas = document.getElementById('inputCanvas')
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, this.state.imageWidth, this.state.imageHeight)
  }

  handlePredict = async () => {
    const {
      imageWidth,
      imageHeight,
      scale,
      imageSplitW,
      imageSplitH,
      PredictSplit,
      modelPadding
    } = this.state
    const tstart = performance.now()
    if (PredictSplit) {
      await srcnn.predictSplit(
        this.model,
        'inputCanvas',
        'outputCanvas',
        imageWidth,
        imageHeight,
        imageSplitW,
        imageSplitH,
        scale,
        modelPadding
      )
    } else {
      await srcnn.predict(
        this.model,
        'inputCanvas',
        'outputCanvas',
        imageWidth,
        imageHeight,
        scale,
        modelPadding
      )
    }
    const tend = performance.now()
    this.setState({
      processTime: Math.floor(tend - tstart).toString() + ' ms'
    })
  }

  handleIframe = () => {
    this.props.iframeSwitch(true)
  }

  handleSplit = () => {
    if (this.state.PredictSplit) {
      this.setState({
        PredictSplit: false
      })
    } else {
      this.setState({
        PredictSplit: true
      })
    }
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
            onClick={this.handleClear}>
            Clear
          </button>
        )
      }
    }

    const renderTrain = () => {
      if (this.state.imageFile.length > 0) {
        return (
          <button
            className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary"
            onClick={this.handlePredict}>
            Enlarge
          </button>
        )
      }
    }

    const renderPredictSplit = () => {
      if (this.state.imageFile.length > 0) {
        if (this.state.PredictSplit) {
          return (
            <button
              className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary"
              onClick={this.handleSplit}>
              Split Predict
            </button>
          )
        } else {
          return (
            <button
              className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent"
              onClick={this.handleSplit}>
              Orig Predict
            </button>
          )
        }
      }
    }

    return (
      <div>
        <label className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary">
          Select Image
          <input
            className="sensor_button_none"
            type="file"
            accept="image/*"
            onChange={this.handleUpload}
            required
          />
        </label>
        {renderClear()}
        {renderTrain()}
        {renderPredictSplit()}
      </div>
    )
  }

  renderImage = () => {
    return (
      <div>
        <img
          className="converter_hidden"
          id="inputImage"
          src={this.state.imageFile[0]}
          width="100%"
          height="100%"
          alt={this.state.text}
        />
        <canvas id="inputCanvas" />
      </div>
    )
  }

  renderProceeTime = () => {
    if (this.state.imageFile.length > 0 && this.state.isBusy === false) {
      return (
        <div>
          <div className="mdl-card__actions mdl-card--border sensor_borderline" />
          <div className="converter-text-box mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
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
          <div className="converter-text-box mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input
              className="mdl-textfield__input"
              type="text"
              id="imageWidth_text"
              readOnly
              value={this.state.imageWidth}
            />
            <label className="mdl-textfield__label" htmlFor="imageWidth_text">
              Width
            </label>
          </div>
          <div className="converter-text-box mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input
              className="mdl-textfield__input"
              type="text"
              id="imageHeight_text"
              readOnly
              value={this.state.imageHeight}
            />
            <label className="mdl-textfield__label" htmlFor="imageHeight_text">
              Height
            </label>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  renderOutput = () => {
    const { imageWidth, imageHeight, scale } = this.state
    if (this.state.imageFile.length > 0) {
      return (
        <div className="mdl-cell mdl-cell--6-col">
          <div className="layout-content mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800">
            <canvas
              id="outputCanvas"
              width={imageWidth * scale}
              height={imageHeight * scale}
            />
          </div>
        </div>
      )
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--4-col" />
          <div className="layout-content mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800 mdl-cell mdl-cell--4-col">
            <MdlBusyBar modelText={'Loading...'} />
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
            {this.renderImage()}
            {this.renderProceeTime()}
            <MdlBusyBar
              modelSwitch={this.state.isBusy}
              modelText={'Processing...'}
              modelBorderUp
            />
          </div>
          {this.renderOutput()}
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
