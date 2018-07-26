import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ImageViewer extends Component {
  render() {
    const { viewerID, classes, image, imageText } = this.props

    return (
      <div>
        <img id={viewerID} className={classes} src={image} alt={imageText} />
      </div>
    )
  }
}

ImageViewer.propTypes = {
  viewerID: PropTypes.string,
  classes: PropTypes.string,
  image: PropTypes.any,
  imageText: PropTypes.string
}

ImageViewer.defaultProps = {
  uploaderID: 'ImageViewer',
  classes: '',
  imageText: 'ImageViewer'
}
