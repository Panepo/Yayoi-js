import React, { Component, PropTypes } from 'react'
import '../../css/ImageUploader.css'

export default class ImageUploader extends Component {
  constructor(props) {
    super(props)
    this.state = { file: null, text: '' }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const { uploaderID, propFunc } = this.props
    let textId = uploaderID + '_imageUploader_text_div'

    if (event.target.files[0] != null) {
      document.getElementById(textId).classList.add('is-focused')
      propFunc(true)
      this.setState({
        file: URL.createObjectURL(event.target.files[0]),
        text: event.target.files[0].name
      })
    } else {
      document.getElementById(textId).classList.remove('is-focused')
      propFunc(false)
      this.setState({
        file: null,
        text: ''
      })
    }
  }

  render() {
    const { uploaderID, classes, displayText, widthMaximum } = this.props
    let textId = uploaderID + '_imageUploader_text_div'
    let imgId = uploaderID + '_imageUploader_img'

    return (
      <div>
        <div className="imageUploader">
          <label className={classes}>
            {displayText}
            <input
              className="imageUploader_none"
              type="file"
              onChange={this.handleChange}
            />
          </label>
        </div>
        <div
          id={textId}
          className="mdl-textfield mdl-js-textfield textfield-demo">
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
            <img id={imgId} src={this.state.file} width={widthMaximum} />
          </p>
        </div>
      </div>
    )
  }
}

ImageUploader.propTypes = {
  uploaderID: PropTypes.string,
  classes: PropTypes.string,
  displayText: PropTypes.string,
  widthMaximum: PropTypes.number,
  propFunc: PropTypes.func
}

ImageUploader.defaultProps = {
  uploaderID: 'ImageUploader',
  classes:
    'imageUploader_Button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary',
  displayText: 'Select Image',
  widthMaximum: 400
}
