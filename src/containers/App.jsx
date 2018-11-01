import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Header from './Header'
import Ribbon from './Ribbon'
import Content from './Content'
import Footer from './Footer'

export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Header />
        <Ribbon />
        <Content />
        <Footer />
      </React.Fragment>
    )
  }
}
