import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FlipMove from 'react-flip-move'
import './ImageGallery.css'

export default class ImageGallery extends Component {
  renderPreview = () => {
    const { modelId, imageSrc, imageWidth, imageHeight, imageText } = this.props
    const preview = imageSrc.reduce((output, data, i) => {
      output.push(
        <img
          className="imageGallery_preview"
          id={modelId + '_imageGallery_image_' + i.toString()}
          key={modelId + '_imageGallery_image_' + i.toString()}
          src={data}
          width={imageWidth}
          height={imageHeight}
          alt={imageText}
        />
      )
      return output
    }, [])
    return <FlipMove className="flip-wrapper">{preview}</FlipMove>
  }

  renderHidden = () => {
    const { renderHidden, modelId, imageSrc, imageText } = this.props
    if (renderHidden) {
      const hidden = imageSrc.reduce((output, data, i) => {
        output.push(
          <img
            className="imageGallery_hidden"
            id={modelId + '_imageGallery_hidden_' + i.toString()}
            key={modelId + '_imageGallery_hidden_' + i.toString()}
            ref={'hidden_' + i.toString()}
            src={data}
            alt={imageText}
          />
        )
        return output
      }, [])
      return <div>{hidden}</div>
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
