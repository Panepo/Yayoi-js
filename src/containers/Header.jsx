import React, { Component } from 'react'
import { listLink } from '../constants/ConstLink'
import './Header.css'

export default class Header extends Component {
  generateLink() {
    const linkOut = []
    for (let i = 0; i < listLink.length; i += 1) {
      let linkKey = 'header-link' + i.toString()
      let linkTemp = (
        <a
          className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary"
          key={linkKey}
          href={listLink[i].link}>
          {listLink[i].text}
        </a>
      )
      linkOut.push(linkTemp)
    }
    return linkOut
  }

  render() {
    return (
      <header className="layout-header mdl-layout__header mdl-layout__header--scroll mdl-color--grey-100 mdl-color-text--grey-800">
        <div className="mdl-layout__header-row mdl-shadow--4dp">
          <span className="mdl-layout-title">
            <b>Yayoi</b>
          </span>
          <div className="mdl-layout-spacer" />
          <nav className="mdl-navigation">{this.generateLink()}</nav>
        </div>
      </header>
    )
  }
}
