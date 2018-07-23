import React, { Component } from 'react'
import { listLink } from '../constants/ConstLink'
import '../../css/Header.css'

export default class Header extends Component {
  generateLink() {
    const linkOut = []
    for (let i = 0; i < listLink.length; i += 1) {
      let linkTemp = (
        <a
          className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary"
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
      <header className="demo-header mdl-layout__header mdl-layout__header--scroll mdl-color--grey-100 mdl-color-text--grey-800">
        <div className="mdl-layout__header-row">
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
