import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { imageUpload } from '../actions'
import ImageUploader from '../components/ImageUploader'
import ImageViewer from '../components/ImageViewer'
import './Content.css'

class Content extends Component {
  generateOutput() {
    const { contentDisplay, imageSource } = this.props
    if (contentDisplay) {
      return (
        <div className="layout-content mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800 mdl-cell mdl-cell--6-col">
          <ImageViewer image={imageSource} />
        </div>
      )
    }
  }

  render() {
    const { imageUpload } = this.props
    return (
      <main className="layout-main mdl-layout__content">
        <div className="layout-container mdl-grid">
          <div className="mdl-cell mdl-cell--1-col mdl-cell--hide-tablet mdl-cell--hide-phone" />
          <div className="layout-content mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800 mdl-cell mdl-cell--4-col">
            <ImageUploader widthMaximum={400} propFunc={imageUpload} />
          </div>
          {this.generateOutput()}
        </div>
      </main>
    )
  }
}

Content.propTypes = {
  imageUpload: PropTypes.func.isRequired,
  contentDisplay: PropTypes.bool.isRequired
}

const mapStateToProps = function mapStateToProps(state) {
  return {
    contentDisplay: state.reducerLayout.contentDisplay,
    imageSource: state.reducerTensor.outputImg
  }
}

const mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    imageUpload: bindActionCreators(imageUpload, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Content)
