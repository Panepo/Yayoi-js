import React, { Component } from 'react'
import { listDrawer } from '../constants/ConstLink'
import './Drawer.css'

export default class Drawer extends Component {
  generateLink() {
    const linkOut = []
    for (let i = 0; i < listDrawer.length; i += 1) {
      let linkTemp = (
        <a className="mdl-navigation__link" href={listDrawer[i].link}>
          {listDrawer[i].text}
        </a>
      )
      linkOut.push(linkTemp)
    }
    return linkOut
  }

  render() {
    return (
      <div className="mdl-layout__drawer">
        <span className="mdl-layout-title">Reference</span>
        <nav className="mdl-navigation">{this.generateLink()}</nav>
      </div>
    )
  }
}
