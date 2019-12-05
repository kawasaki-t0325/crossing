import React from 'react';
import {
  makeStyles,
  Container,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  container: {
    position: 'fixed',
    maxWidth: 'initial',
    margin: 0,
    padding: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: '100vh',
    width: '100vw',
    backgroundColor: '#000',
    opacity: 0.7,
    zIndex: 1,
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
}));

function Loading() {
  const classes = useStyles();
  return (
    <Container className={`${classes.container} ${classes.flex}`}>
      <p className={classes.text}>test</p>
    </Container>
  );
}

export default Loading;