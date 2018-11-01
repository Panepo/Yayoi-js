import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import withRoot from '../withRoot'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import IconBookmark from '@material-ui/icons/Bookmarks'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { listLink, listDrawer } from '../constants/ConstLink'

const styles = theme => ({
  root: {},
  appBar: {
    position: 'relative'
  },
  button: {
    margin: theme.spacing.unit
  },
  drawer: {
    color: '#616161'
  },
  drawerTitle: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    color: '#3333ff',
    marginLeft: -12,
    marginRight: 20
  }
})

class Header extends React.Component {
  state = {
    drawer: false
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    })
  }

  render() {
    const { classes } = this.props

    const renderLink = listLink.reduce((output, data, i) => {
      output.push(
        <Button color="primary" className={classes.button} href={data.link}>
          {data.text}
        </Button>
      )
      return output
    }, [])

    const renderDrawer = (
      <List>
        {listDrawer.map(data => (
          <ListItem
            button
            divider
            key={data.text}
            component="a"
            href={data.link}>
            <ListItemIcon>
              <IconBookmark />
            </ListItemIcon>
            <ListItemText primary={data.text} />
          </ListItem>
        ))}
      </List>
    )

    return (
      <header className={classes.root}>
        <AppBar position="static" color="inherit" className={classes.appBar}>
          <Drawer
            className={classes.drawer}
            open={this.state.drawer}
            onClose={this.toggleDrawer('drawer', false)}>
            <Typography
              className={classes.drawerTitle}
              variant="h6"
              color="inherit"
              noWrap>
              Reference
            </Typography>
            <div
              tabIndex={0}
              role="button"
              onClick={this.toggleDrawer('drawer', false)}
              onKeyDown={this.toggleDrawer('drawer', false)}>
              {renderDrawer}
            </div>
          </Drawer>
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.toggleDrawer('drawer', true)}>
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              color="inherit"
              className={classes.grow}
              noWrap>
              Yayoi
            </Typography>
            {renderLink}
          </Toolbar>
        </AppBar>
      </header>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRoot(withStyles(styles)(Header))
