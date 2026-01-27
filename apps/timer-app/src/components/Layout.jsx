import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton component="a" href="https://thewhitejersey.com" target="_blank" rel="noopener noreferrer">
            <ListItemText primary="The White Jersey Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="https://thewhitejersey.com/apps/zone-calc" target="_blank" rel="noopener noreferrer">
            <ListItemText primary="Zone Calc App" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <AppBar position="static" sx={{ bgcolor: 'navy' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button
              color="inherit"
              href="https://thewhitejersey.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textTransform: 'none', fontSize: '1.25rem' }}
            >
              The White Jersey
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{ textTransform: 'none', fontSize: '1.25rem', ml: 2 }}
            >
              Back to Home
            </Button>
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {list()}
      </Drawer>
      <main>
        {children}
      </main>
    </div>
  );
}

export default Layout;

