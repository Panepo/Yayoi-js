import React from 'react'
import PropTypes from 'prop-types'
import * as tf from '@tensorflow/tfjs'
import * as srcnn from '../deeplearn/Srcnn'
import * as util from '../deeplearn/Srcnn.util'
import MucProgress from '../componments/MucProgress'
import MucText from '../componments/MucText'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import withRoot from '../withRoot'

const styles = theme => ({
  root: {
    marginTop: '-55vh',
    marginBottom: '60px',
    flex: 1
  },
  grid: {
    flexGrow: 1,
    width: '100%'
  },
  paper: {
    borderRadius: '2px',
    paddingTop: '80px',
    paddingBottom: '80px',
    paddingLeft: '56px',
    paddingRight: '56px'
  },
  border: {
    marginTop: '10px',
    marginBottom: '10px'
  },
  hidden: {
    display: 'none'
  }
})

class Content extends React.Component {
  state = {
    isLoading: true,
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
  // React event handler functions
  // ================================================================================

  handleUpload = event => {
    const data = []

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

    if (data.length > 0) {
      this.setState({
        imageFile: data,
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

  // ================================================================================
  // React render functions
  // ================================================================================

  renderButton = () => {
    const { classes } = this.props
    const renderClear = () => {
      if (this.state.imageFile.length > 0) {
        return (
          <Button color="primary" onClick={this.handleClear}>
            Clear
          </Button>
        )
      }
    }

    const renderEnlarge = () => {
      if (this.state.imageFile.length > 0) {
        return (
          <Button color="primary" onClick={this.handlePredict}>
            Enlarge
          </Button>
        )
      }
    }

    return (
      <div>
        <Button color="primary" component="label">
          Select Image
          <input
            className={classes.hidden}
            type="file"
            accept="image/*"
            onChange={this.handleUpload}
            required
          />
        </Button>
        {renderClear()}
        {renderEnlarge()}
      </div>
    )
  }

  renderImage = () => {
    return (
      <div>
        <img
          className={this.props.classes.hidden}
          id="inputImage"
          src={this.state.imageFile[0]}
          width="100%"
          height="100%"
          alt={this.state.text}
        />
        <Grid container justify="center" alignItems="center">
          <canvas className={this.props.classes.canvas} id="inputCanvas" />
        </Grid>
      </div>
    )
  }

  renderTextBox = () => {
    const { classes } = this.props
    if (this.state.imageFile.length > 0) {
      return (
        <div>
          <Divider className={classes.border} />
          <MucText
            modelId="text-input-time"
            modelLabel="Process Time"
            modelValue={this.state.processTime}
          />
          <MucText
            modelId="text-input-width"
            modelLabel="Width"
            modelValue={this.state.imageWidth}
          />
          <MucText
            modelId="text-input-height"
            modelLabel="Height"
            modelValue={this.state.imageHeight}
          />
        </div>
      )
    }
  }

  renderOutput = () => {
    const { classes } = this.props
    const { imageWidth, imageHeight, scale } = this.state
    if (this.state.imageFile.length > 0) {
      return (
        <Paper className={classes.paper}>
          <Grid container justify="center" alignItems="center">
            <canvas
              id="outputCanvas"
              width={imageWidth * scale}
              height={imageHeight * scale}
            />
          </Grid>
        </Paper>
      )
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
            spacing={16}>
            <Grid item xs={4}>
              <Paper className={classes.paper}>
                <MucProgress modelText={'Loading...'} />
              </Paper>
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
            spacing={16}>
            <Grid item xs={4}>
              <Paper className={classes.paper}>
                {this.renderButton()}
                <Divider className={classes.border} />
                {this.renderImage()}
                {this.renderTextBox()}
              </Paper>
            </Grid>
            <Grid item xs={6}>
              {this.renderOutput()}
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
