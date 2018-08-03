import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import * as tf from '@tensorflow/tfjs'
import { checkHW, rgba2ycbcr, ycbcr2rgb } from './ModelSRCNN.util'
import * as modelConfig from './ModelSRCNN.config'
import './ModelSRCNN.css'

export default class ModelSRCNN extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      text: '',
      contentDisplay: false,
      isLoading: true,
      imageWidth: 100,
      imageHeight: 100,
      canvasWidth: 200,
      canvasHeight: 200,
      maxWidth: 200,
      maxHeight: 200
    }
    this.handleUpload = this.handleUpload.bind(this)
  }

  componentDidMount() {
    this.modelLoad()
    setTimeout(() => this.setState({ isLoading: false }), 5000)
  }

  handleUpload(event) {
    const textDiv = this.refs.textDiv

    if (event.target.files[0] != null) {
      textDiv.classList.add('is-focused')
      this.setState({
        file: URL.createObjectURL(event.target.files[0]),
        text: event.target.files[0].name,
        contentDisplay: true
      })
      this.canvasDraw()
    } else {
      textDiv.classList.remove('is-focused')
      this.setState({
        file: null,
        text: '',
        contentDisplay: false
      })
    }
  }

  canvasDraw = () => {
    const canvasi = this.refs.inputCanvas
    const canvaso = this.refs.outputCanvas
    const ctxi = canvasi.getContext('2d')
    const image = ReactDOM.findDOMNode(this.refs.inputImage)

    image.onload = () => {
      let imgWidth
      let imgHeight
      ;[imgWidth, imgHeight] = checkHW(
        image.naturalWidth,
        image.naturalHeight,
        this.state.maxWidth,
        this.state.maxHeight
      )

      this.setState({
        imageWidth: imgWidth,
        imageHeight: imgHeight,
        canvasWidth: imgWidth * 4,
        canvasHeight: imgHeight * 4
      })
      ctxi.clearRect(0, 0, this.state.imageWidth, this.state.imageHeight)
      ctxi.drawImage(image, 0, 0, this.state.imageWidth, this.state.imageHeight)

      this.modelPredict(canvasi, canvaso)
    }
  }

  modelLoad = async () => {
    this.model = await tf.loadModel(modelConfig.modelPath)
    this.model.predict(tf.zeros([1, 32, 32, 1])).dispose()
  }

  modelPredict = async (input, output) => {
    const canvast = this.refs.tempCanvas
    const ctxt = canvast.getContext('2d')
    ctxt.clearRect(0, 0, this.state.imageWidth, this.state.imageHeight)
    const ctxo = output.getContext('2d')
    ctxo.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight)
    rgba2ycbcr(input, canvast)
    ycbcr2rgb(canvast, canvast)

    const imagePredict = tf.tidy(() => {
      const imageData = tf
        .fromPixels(canvast)
        .toFloat()
        .div(tf.scalar(255))
      const imageScale = tf.image.resizeBilinear(
        imageData,
        [this.state.canvasWidth, this.state.canvasHeight],
        false
      )
      const batched = imageScale.reshape([
        1,
        modelConfig.inputShape,
        modelConfig.inputShape,
        1
      ])
      const predict = this.model
        .predict(batched)
        .mul(tf.scalar(255))
        .toInt()
      return predict
    })
    tf.toPixels(imagePredict, output)
  }

  render() {
    let canvasClass = ''
    if (this.state.contentDisplay) {
      canvasClass =
        'layout-content mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800 mdl-cell mdl-cell--7-col'
    } else {
      canvasClass = 'canvas-none'
    }

    if (this.state.isLoading) {
      return (
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--4-col" />
          <div className="layout-content mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800 mdl-cell mdl-cell--4-col">
            <span>Loading...</span>
            <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate" />
          </div>
        </div>
      )
    } else {
      return (
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--1-col mdl-cell--hide-tablet mdl-cell--hide-phone" />
          <div className="layout-content mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800 mdl-cell mdl-cell--3-col">
            <div className="imageUploader">
              <label className="imageUploader_Button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary">
                Select Image
                <input
                  className="imageUploader_none"
                  type="file"
                  onChange={this.handleUpload}
                />
              </label>
            </div>
            <div ref="textDiv" className="mdl-textfield mdl-js-textfield">
              <input
                className="imageUploader_text mdl-textfield__input"
                type="text"
                readOnly
                disabled
                id="file_input_text"
                value={this.state.text}
              />
              <label
                className="mdl-textfield__label"
                htmlFor="imageUploader_text"
              />
            </div>
            <div className="canvas-none">
              <p className="imageUploader_image">
                <img
                  ref="inputImage"
                  src={this.state.file}
                  width="100%"
                  height="100%"
                  alt={this.state.text}
                />
              </p>
            </div>
            <div>
              <canvas
                ref="inputCanvas"
                width={this.state.imageWidth}
                height={this.state.imageHeight}
              />
            </div>
            <div className="canvas-none">
              <canvas
                ref="tempCanvas"
                width={this.state.imageWidth}
                height={this.state.imageHeight}
              />
            </div>
          </div>
          <div className={canvasClass}>
            <canvas
              ref="outputCanvas"
              width={this.state.canvasWidth}
              height={this.state.canvasHeight}
            />
          </div>
        </div>
      )
    }
  }
}
