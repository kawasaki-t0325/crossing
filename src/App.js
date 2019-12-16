import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Container,
  TextField,
  Typography,
  Grid,
  Button,
  Link,
  Box
} from "@material-ui/core";
import Loading from './components/Loading';
import Copyright from './components/Copyright';
import AspInput from './components/AspInput';
import httpRequest from './modules/httpRequest';
import localStorage from './modules/localStorage';
import { SITE_IDS, RESPONSE_STATUS, MESSSGE } from './config';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.grey[50],
      fontFamily: 'Noto sans JP'
    }
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title_wrapper: {
    marginTop: theme.spacing(24),
  },
  title: {
    fontFamily: 'Georgia-BoldItalic',
  },
  main: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(2),
    padding: theme.spacing(2, 4),
  },
  textWarning: {
    color: '#d50000'
  },
  footer: {
    marginTop: theme.spacing(8),
  },
}));

function App() {
  const classes = useStyles();
  const [loadging, setLoading] = useState(true);
  const [result, setResult] = useState({
    a8Result: {},
    afbResult: {},
    moshimoResult: {},
  });
  const [word, setWord] = useState('');
  const [message, setMessage] = useState('');

  const asps = [
    {
      title: 'A8.net',
      usernameKey: 'usernameA8',
      passwordKey: 'passwordA8',
      result: result.a8Result,
    },
    {
      title: 'afb',
      usernameKey: 'usernameAfb',
      passwordKey: 'passwordAfb',
      result: result.afbResult,
    },
    {
      title: 'もしもアフィリエイト',
      usernameKey: 'usernameMoshimo',
      passwordKey: 'passwordMoshimo',
      result: result.moshimoResult,
    },
  ];

  useEffect(() => {
    setLoading(false);
  }, [result]);

  const search = async () => {
    // 1日の上限検索回数を超えていないかチェックする
    if (!localStorage.countUp()) {
      setMessage(MESSSGE.OVER_LIMIT);
      return;
    }

    // レスポンスが返ってくるまでloading状態にする
    setLoading(true);

    Promise.all([
      httpRequest.httpRequest(SITE_IDS.A8, word),
      httpRequest.httpRequest(SITE_IDS.AFB, word),
      httpRequest.httpRequest(SITE_IDS.MOSHIMO, word),
    ]).then(result => {
      setResult({
        a8Result: result[0],
        afbResult: result[1],
        moshimoResult: result[2],
      });

      isAllError(result) && localStorage.countDown();
    });
  };

  const isAllError = results => {
    return results.filter(result => result['code'] === RESPONSE_STATUS.SUCCESS).length === 0;
  };

  const isResultEmpty = () => {
    return Object.values(result).filter(projectResult => Object.keys(projectResult).length !== 0).length === 0;
  };

  return (
    <React.Fragment>
      {loadging && <Loading />}
      <Container className={`${classes.container} ${classes.title_wrapper}`}>
        <Typography className={classes.title} align="center" variant="h3">Crossing</Typography>
      </Container>
      <Container className={classes.main} component="main">
        <Grid container justify="center">
          <Container className={classes.container} maxWidth="md">
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              autoFocus
              placeholder="検索商品"
              value={word}
              onChange={event => setWord(event.target.value)}
            />
            <Button className={classes.button} disabled={loadging} variant="contained" color="primary" onClick={search}>
              検索する
            </Button>
            <Grid item xs={12}>
              {message && <Typography align="center" className={classes.textWarning}>{message}</Typography>}
            </Grid>
          </Container>
        </Grid>
        <Grid container spacing={5} justify="center">
          {!isResultEmpty() && asps.map((asp, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <AspInput
                key={asp.title}
                asp={asp}
              />
            </Grid>
          ))}
        </Grid>
        <Box className={classes.footer} mt={5}>
          <Typography align="center">
            <Link href="https://twitter.com/memorandumrail">Twitter</Link>{' '}|{' '}
            <Link href="https://memorandumrail.com/contact">お問い合わせ</Link>
          </Typography>
          <Copyright />
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default App;
