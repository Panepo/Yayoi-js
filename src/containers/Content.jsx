import React from 'react'
import PropTypes from 'prop-types'
import * as tf from '@tensorflow/tfjs'
import * as srcnn from './Srcnn'
import * as util from './Srcnn.util'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import withRoot from '../withRoot'

const styles = theme => ({
  root: {
    marginTop: '-55vh',
    flexShrink: 0,
    maxWidth: '1600px',
    width: 'calc(100% - 16px)',
    margin: 0
  },
  grid: {
    flexGrow: 1
  },
  paper: {
    borderRadius: '2px',
    paddingTop: '80px',
    paddingBottom: '56px',
    marginBottom: '80px'
  }
})

class Content extends React.Component {
  state = {
    isLoading: true,
    isBusy: false,
    imageFile: [],
    imageWidth: 200,
    imageHeight: 200,
    imageSize: 1000000,
    processTime: '0',
    scale: 2,
    modelPadding: 6,
    PredictSplit: true,
    imageSplitW: 5,
    imageSplitH: 5
  }

  constructor(props) {
    super(props)
    this.handleUpload = this.handleUpload.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handlePredict = this.handlePredict.bind(this)
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
            imageSplitW: Math.ceil(canvas.width / 75),
            imageSplitH: Math.ceil(canvas.height / 75)
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

  render() {
    const { classes } = this.props

    if (this.state.isLoading) {
      return (
        <main className={classes.root}>
          <Grid
            container
            className={classes.grid}
            justify="center"
            spacing={12}>
            <Grid item xs={12}>
              <Paper className={classes.main}>FQ</Paper>
            </Grid>
          </Grid>
        </main>
      )
    } else {
      return (
        <main className={classes.root}>
          <Grid
            container
            className={classes.grid}
            justify="center"
            spacing={12}>
            <Grid item xs={12}>
              <Paper className={classes.main}>FQQ</Paper>
            </Grid>
          </Grid>
        </main>
      )
    }
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRoot(withStyles(styles)(Content))
