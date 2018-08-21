import React, { Component } from 'react'
import { listDrawer } from '../constants/ConstLink'
import './Drawer.css'

export default class Drawer extends Component {
  renderLink = () => {
    return listDrawer.reduce((output, data, i) => {
      output.push(
        <a
          className="mdl-navigation__link mdl-typography--subhead"
          key={'drawer-link' + i.toString()}
          href={data.link}
        >
          {data.text}
        </a>
      )
      return output
    }, [])
  }

  render() {
    return (
      <div className="mdl-layout__drawer">
        <span className="mdl-layout-title mdl-typography--subhead">
          Reference
        </span>
        <nav className="mdl-navigation">{this.renderLink()}</nav>
      </div>
    )
  }
}
