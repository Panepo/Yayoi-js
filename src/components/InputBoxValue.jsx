import React, { Component, PropTypes } from 'react'

export default class InputBoxValue extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      text: this.props.defaultValue
    }
  }

  handleInput(event) {
    const modelId = event.target.id
    let modelValue = parseInt(event.target.value, 10)

    if (isNaN(modelValue)) {
      modelValue = 0
      this.setState({ text: modelValue })
    } else {
      this.setState({ text: modelValue })
      this.props.inputFunc(modelId, modelValue)
    }
  }

  render() {
    const { title, modelId, classes } = this.props
    const classDiv =
      ' mdl-textfield mdl-js-textfield mdl-textfield--floating-label'
    const classInp = 'mdl-textfield__input'
    const classLab = 'mdl-textfield__label'
    const classErr = 'mdl-textfield__error'

    return (
      <div className={classes + classDiv}>
        <input
          className={classInp}
          type="text"
          pattern="-?[0-9]*(\.[0-9]+)?"
          id={modelId}
          onChange={this.handleInput.bind(this)}
          value={this.state.text}
        />
        <label className={classLab} htmlFor={modelId}>
          {title}
        </label>
        <span className={classErr}>The input value is incorrect.</span>
      </div>
    )
  }
}

InputBoxValue.propTypes = {
  classes: PropTypes.string,
  title: PropTypes.string,
  modelId: PropTypes.string,
  inputFunc: PropTypes.func,
  defaultValue: PropTypes.number
}

InputBoxValue.defaultProps = {
  classes: 'InputBoxValue',
  title: 'InputBoxValue',
  modelId: 'InputBoxValue',
  defaultValue: 0
}
