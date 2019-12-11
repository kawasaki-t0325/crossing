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
    marginTop: theme.spacing(8),
  },
  title: {
    fontFamily: 'Georgia-BoldItalic',
  },
  main: {
    marginTop: theme.spacing(4),
  },
  button: {
    padding: theme.spacing(2, 4),
  },
  textWarning: {
    color: '#d50000'
  },
}));

function App() {
  const classes = useStyles();
  const [loadging, setLoading] = useState(true);
  const [value, setValue] = useState({
    usernameA8: '',
    passwordA8: '',
    usernameAfb: '',
    passwordAfb: '',
    usernameMoshimo: '',
    passwordMoshimo: '',
  });
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
      username: value.usernameA8,
      passwordA8: value.passwordA8,
      result: result.a8Result,
    },
    {
      title: 'afb',
      usernameKey: 'usernameAfb',
      passwordKey: 'passwordAfb',
      username: value.usernameAfb,
      password: value.passwordAfb,
      result: result.afbResult,
    },
    {
      title: 'もしもアフィリエイト',
      usernameKey: 'usernameMoshimo',
      passwordKey: 'passwordMoshimo',
      username: value.usernameMoshimo,
      password: value.passwordMoshimo,
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

    const { usernameA8, usernameMoshimo, usernameAfb, passwordA8, passwordMoshimo, passwordAfb } = value;
    Promise.all([
      httpRequest.httpRequest(SITE_IDS.A8, word, usernameA8, passwordA8),
      httpRequest.httpRequest(SITE_IDS.AFB, word, usernameAfb, passwordAfb),
      httpRequest.httpRequest(SITE_IDS.MOSHIMO, word, usernameMoshimo, passwordMoshimo),
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

  const changeText = event => {
    setValue({
      ...value,
      [event.target.name]: event.target.value
    });
  };

  return (
    <React.Fragment>
      {loadging && <Loading />}
      <Container className={`${classes.container} ${classes.title_wrapper}`}>
        <Typography className={classes.title} align="center" variant="h3">Crossing</Typography>
      </Container>
      <Container className={classes.main} component="main">
        <Grid container spacing={5} justify="center">
          {asps.map(asp => (
            <Grid item xs={12} sm={6} md={4}>
              <AspInput
                key={asp.title}
                asp={asp}
                value={value}
                changeText={changeText}
              />
            </Grid>
          ))}
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
          </Container>
          <Grid item xs={12}>
            {message && <Typography align="center" className={classes.textWarning}>{message}</Typography>}
          </Grid>
        </Grid>
        <Box mt={5}>
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
