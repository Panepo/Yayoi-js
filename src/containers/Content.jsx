import React, { Component } from 'react'
import ModelSRCNN from '../components/ModelSRCNN'
import './Content.css'

export default class Content extends Component {
  render() {
    return (
      <main className="layout-main mdl-layout__content">
        <ModelSRCNN />
      </main>
    )
  }
}
