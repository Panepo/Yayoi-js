import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FlipMove from 'react-flip-move'
import './ImageGallery.css'

export default class ImageGallery extends Component {
  renderPreview = () => {
    const { modelId, imageSrc, imageWidth, imageHeight, imageText } = this.props
    const output = []
    let outTemp
    let outKeyTemp

    for (let i = 0; i < imageSrc.length; i += 1) {
      outKeyTemp = modelId + '_imageGallery_image_' + i.toString()
      outTemp = (
        <img
          className="imageGallery_preview"
          id={outKeyTemp}
          key={outKeyTemp}
          src={imageSrc[i]}
          width={imageWidth}
          height={imageHeight}
          alt={imageText}
        />
      )
      output.push(outTemp)
    }

    return <FlipMove className="flip-wrapper">{output}</FlipMove>
  }

  renderHidden = () => {
    const { renderHidden, modelId, imageSrc, imageText } = this.props
    const output = []
    let outTemp
    let outKeyTemp
    let outRefTemp

    if (renderHidden) {
      for (let i = 0; i < imageSrc.length; i += 1) {
        outKeyTemp = modelId + '_imageGallery_hidden_' + i.toString()
        outRefTemp = 'hidden_' + i.toString()
        outTemp = (
          <img
            className="imageGallery_hidden"
            id={outKeyTemp}
            key={outKeyTemp}
            ref={outRefTemp}
            src={imageSrc[i]}
            alt={imageText}
          />
        )
        output.push(outTemp)
      }
      return <div>{output}</div>
    }
  }

  render() {
    return (
      <div>
        {this.renderPreview()}
        {this.renderHidden()}
      </div>
    )
  }
}

ImageGallery.propTypes = {
  modelId: PropTypes.string,
  imageSrc: PropTypes.array,
  imageWidth: PropTypes.number,
  imageHeight: PropTypes.number,
  imageText: PropTypes.string,
  renderHidden: PropTypes.bool
}

ImageGallery.defaultProps = {
  modelId: 'ImageGallery',
  imageWidth: 100,
  imageHeight: 100,
  imageText: 'ImageGallery',
  renderHidden: false
}
