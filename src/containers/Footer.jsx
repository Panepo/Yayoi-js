import React, { Component } from 'react'

export default class Footer extends Component {
  render() {
    return (
      <footer className="mdl-mini-footer">
        <div className="mdl-mini-footer--left-section">
          <div>
            <small>
              {' '}
              Copyright &copy; Panepo@Github 2018 All Rights Reserved.
            </small>
          </div>
        </div>
      </footer>
    )
  }
}
