import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as tf from '@tensorflow/tfjs'
import './ModelSRCNN.css'

export default class ModelSRCNN extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      text: '',
      contentDisplay: false,
      isLoading: true
    }
    this.handleUpload = this.handleUpload.bind(this)
  }

  componentDidMount() {
    this.modelLoad()
    setTimeout(() => this.setState({ isLoading: false }), 5000)
  }

  componentDidUpdate() {
    const canvas = this.refs.outputCanvas
    const ctx = canvas.getContext('2d')
    const image = this.refs.inputImage

    image.onload = () => {
      ctx.drawImage(image, 0, 0)
    }
  }

  handleUpload(event) {
    const { uploaderID } = this.props
    let textId = uploaderID + '_imageUploader_text_div'

    if (event.target.files[0] != null) {
      document.getElementById(textId).classList.add('is-focused')
      this.setState({
        file: URL.createObjectURL(event.target.files[0]),
        text: event.target.files[0].name,
        contentDisplay: true
      })
    } else {
      document.getElementById(textId).classList.remove('is-focused')
      this.setState({
        file: null,
        text: '',
        contentDisplay: false
      })
    }
  }

  modelLoad = async () => {
    const { modelPath } = this.props
    this.model = await tf.loadModel(modelPath)
    this.model.predict(tf.zeros([1, 32, 32, 1])).dispose()
  }

  modelPredict = async () => {
    await tf.tidy(() => {
      const image = this.refs.inputImage
      const img = tf.fromPixels(image).toFloat()
      const offset = tf.scalar(255)

      const normalized = img.div(offset)
      const batched = normalized.reshape([1, 32, 32, 1])
      const result = this.model.predict(batched)

      console.log(result)
    })
  }

  render() {
    const {
      uploaderID,
      uploaderClass,
      buttonText,
      imageWidth,
      canvasWidth,
      canvasHeight
    } = this.props
    let textId = uploaderID + '_imageUploader_text_div'

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
              <label className={uploaderClass}>
                {buttonText}
                <input
                  className="imageUploader_none"
                  type="file"
                  onChange={this.handleUpload}
                />
              </label>
            </div>
            <div id={textId} className="mdl-textfield mdl-js-textfield">
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
            <div>
              <p className="imageUploader_image">
                <img
                  ref="inputImage"
                  src={this.state.file}
                  width={imageWidth}
                  alt={this.state.text}
                />
              </p>
            </div>
          </div>
          <div className={canvasClass}>
            <canvas
              ref="outputCanvas"
              width={canvasWidth}
              height={canvasHeight}
            />
          </div>
        </div>
      )
    }
  }
}

ModelSRCNN.propTypes = {
  uploaderID: PropTypes.string,
  uploaderClass: PropTypes.string,
  buttonText: PropTypes.string,
  imageWidth: PropTypes.number,
  canvasWidth: PropTypes.number,
  canvasHeight: PropTypes.number,
  modelPath: PropTypes.string
}

ModelSRCNN.defaultProps = {
  uploaderID: 'ImageUploader',
  uploaderClass:
    'imageUploader_Button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary',
  buttonText: 'Select Image',
  imageWidth: 300,
  canvasWidth: 600,
  canvasHeight: 600,
  modelPath: './model/model.json'
}
