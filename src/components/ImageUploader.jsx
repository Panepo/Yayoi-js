import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './ImageUploader.css'

export default class ImageUploader extends Component {
  constructor(props) {
    super(props)
    this.state = { file: null, text: '' }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const { uploaderID, propFunc } = this.props
    let textId = uploaderID + '_imageUploader_text_div'
    let imgId = uploaderID + '_imageUploader_img'

    if (event.target.files[0] != null) {
      document.getElementById(textId).classList.add('is-focused')
      propFunc(imgId, true)
      this.setState({
        file: URL.createObjectURL(event.target.files[0]),
        text: event.target.files[0].name
      })
    } else {
      document.getElementById(textId).classList.remove('is-focused')
      propFunc(uploaderID, false)
      this.setState({
        file: null,
        text: ''
      })
    }
  }

  render() {
    const { uploaderID, uploaderClass, buttonText, imageWidth } = this.props
    let textId = uploaderID + '_imageUploader_text_div'
    let imgId = uploaderID + '_imageUploader_img'

    return (
      <div>
        <div className="imageUploader">
          <label className={uploaderClass}>
            {buttonText}
            <input
              className="imageUploader_none"
              type="file"
              onChange={this.handleChange}
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
              id={imgId}
              src={this.state.file}
              width={imageWidth}
              alt={this.state.text}
            />
          </p>
        </div>
      </div>
    )
  }
}

ImageUploader.propTypes = {
  uploaderID: PropTypes.string,
  uploaderClass: PropTypes.string,
  buttonText: PropTypes.string,
  imageWidth: PropTypes.number,
  propFunc: PropTypes.func
}

ImageUploader.defaultProps = {
  uploaderID: 'ImageUploader',
  uploaderClass:
    'imageUploader_Button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary',
  buttonText: 'Select Image',
  imageWidth: 400
}
