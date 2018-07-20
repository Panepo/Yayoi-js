import React, { Component } from 'react'
import Header from './Header'
import Content from './Content'
import Footer from './Footer'

export default class App extends Component {
  render() {
    return (
      <div>
        <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
          <Header />
          <div className="demo-ribbon" />
          <Content />
          <Footer />
        </div>
      </div>
    )
  }
}
