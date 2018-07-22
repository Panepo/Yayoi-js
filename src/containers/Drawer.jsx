import React, { Component } from 'react'
import '../../css/Drawer.css'

export default class Drawer extends Component {
  render() {
    return (
      <div className="mdl-layout__drawer">
        <span className="mdl-layout-title">License</span>
        <nav className="mdl-navigation">
          <a
            className="mdl-navigation__link"
            href="http://www.dmm.com/netgame_s/oshirore/"
          >
            城プロRE
          </a>
          <a
            className="mdl-navigation__link"
            href="https://facebook.github.io/react/"
          >
            React
          </a>
          <a className="mdl-navigation__link" href="http://redux.js.org/">
            Redux
          </a>
          <a className="mdl-navigation__link" href="https://getmdl.io/">
            Material Design Lite
          </a>
          <a className="mdl-navigation__link" href="http://lokijs.org/">
            LokiJS
          </a>
        </nav>
      </div>
    )
  }
}