import React from 'react';
import {
  makeStyles,
  Container,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  '@keyframes turn': {
    from :{
      transform: 'rotateX(0deg)',
      transformOrigin: '0 2vw',
    },
    to :{
      transform: 'rotateX(360deg)',
      transformOrigin: '0 2vw',
    },
  },
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
    opacity: 0.9,
    zIndex: 1,
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
  },
  border: {
    position: 'relative',
    height: '100%',
    width: '100%'
  },
  textWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateY(-50%) translateX(-50%)',
    color: '#fff',
  },
  text: {
    margin: theme.spacing(1),
    animation: '$turn 3s infinite',
  },
  warning: {
    marginTop: theme.spacing(3),
  }
}));

function Loading() {
  const classes = useStyles();

  return (
    <Container className={`${classes.container} ${classes.flex}`}>
      <div className={classes.border}>
        <div className={classes.textWrapper}>
          <div className={classes.flex} style={{ borderBottom: '2px solid #fff', }}>
            {'LOADING…'.split('').map((text, index) => {
              return <div key={index} className={classes.text} style={{ animationDelay: `${index / 10}s`, }}>{text}</div>;
            })}
          </div>
          <p className={classes.warning}>※検索には20~30秒前後の時間がかかります</p>
        </div>
      </div>
    </Container>
  );
}

export default Loading;