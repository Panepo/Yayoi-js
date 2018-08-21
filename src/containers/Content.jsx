import React, { Component } from 'react'
import Converter from './Converter'
import './Content.css'

export default class Content extends Component {
  render() {
    return (
      <main className="layout-main mdl-layout__content">
        <Converter />
      </main>
    )
  }
}
