import React, { Component, PropTypes } from 'react'
import '../../css/ImageUploader.css'

export default class ImageUploader extends Component {
  constructor(props) {
    super(props)
    this.state = { file: null, text: '' }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    if (event.target.files[0] != null) {
      document
        .getElementById('imageUploader_text_div')
        .classList.add('is-focused')

      this.setState({
        file: URL.createObjectURL(event.target.files[0]),
        text: event.target.files[0].name
      })
    } else {
      document
        .getElementById('imageUploader_text_div')
        .classList.remove('is-focused')
    }
  }

  render() {
    const { classes, displayText } = this.props

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
          id="imageUploader_text_div"
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
            <img src={this.state.file} width="250" />
          </p>
        </div>
      </div>
    )
  }
}

ImageUploader.propTypes = {
  classes: PropTypes.string,
  displayText: PropTypes.string
}

ImageUploader.defaultProps = {
  classes:
    'imageUploader_Button mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary',
  displayText: 'Select Image'
}
