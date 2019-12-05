import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Container,
  TextField,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Button,
  Link,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Box
} from "@material-ui/core";
import httpRequest from './modules/httpRequest';
import localStorage from './modules/localStorage';
import { SITE_IDS, RESPONSE_STATUS, MESSSGE } from './config';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://memorandumrail.com/">
        Memorandumrail
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.grey[50],
    }
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginTop: theme.spacing(8),
  },
  main: {
    marginTop: theme.spacing(4),
  },
  button: {
    padding: theme.spacing(2, 4),
  },
  relative: {
    position: 'relative',
  },
  progress: {
    position: 'absolute',
    left: '50%',
    marginLeft: -12,
  },
  textWarning: {
    color: '#d50000'
  }
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
    });
  };

  const changeText = event => {
    setValue({
      ...value,
      [event.target.name]: event.target.value
    });
  };

  return (
    <React.Fragment>
      <Container className={`${classes.container} ${classes.title}`}>
        <Typography align="center" variant="h3">Crossing</Typography>
      </Container>
      <Container className={classes.main} component="main">
        <Grid container spacing={5} justify="center">
          {asps.map(asp => (
            <Grid item key={asp.title} xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  title={asp.title}
                  titleTypographyProps={{ align: 'center' }}
                />
                <CardContent>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    placeholder="ユーザー名"
                    name={asp.usernameKey}
                    value={value.username}
                    onChange={changeText}
                  />
                  <TextField
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    placeholder="パスワード"
                    name={asp.passwordKey}
                    value={value.password}
                    onChange={changeText}
                  />
                </CardContent>
                <CardContent className={classes.relative}>
                  {loadging
                    ? <CircularProgress size={24} className={classes.progress}/>
                    : (
                      <React.Fragment>
                        <Typography
                          align="center"
                          className={(asp.result.code !== RESPONSE_STATUS.SUCCESS) ? classes.textWarning : ''}
                        >
                          {asp.result.message} {asp.result.count &&
                        <span>{asp.result.product.length}/{asp.result.count}件表示</span>}
                        </Typography>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>プロジェクト名</TableCell>
                              <TableCell>報酬</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {asp.result.product && asp.result.product.map((product, index) => (
                              <TableRow key={index}>
                                <TableCell><Link href={product.url}>{product.name}</Link></TableCell>
                                <TableCell><Typography>{product.price}</Typography></TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </React.Fragment>
                    )
                  }
                </CardContent>
              </Card>
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
          <Copyright />
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default App;
