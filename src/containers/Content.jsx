import React, { Component } from 'react'
import '../../css/Content.css'

export default class Content extends Component {
  render() {
    return (
      <main className="demo-main mdl-layout__content">
        <div className="demo-container mdl-grid">
          <div className="mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone" />
          <div className="content demo-content mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800 mdl-cell mdl-cell--4-col" />
          <div className="content demo-content mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800 mdl-cell mdl-cell--4-col" />
        </div>
      </main>
    )
  }
}
