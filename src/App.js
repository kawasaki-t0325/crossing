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
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Box
} from "@material-ui/core";
import Loading from './components/Loading';
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
      result: result.a8Result,
    },
    {
      title: 'afb',
      result: result.afbResult,
    },
    {
      title: 'もしもアフィリエイト',
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
    });

    if (isAllError()) {
      localStorage.countDown();
    }
  };

  const isAllError = () => {
    return (result.a8Result['code'] !== RESPONSE_STATUS.SUCCESS)
      && (result.moshimoResult['code'] !== RESPONSE_STATUS.SUCCESS)
      && (result.afbResult['code'] !== RESPONSE_STATUS.SUCCESS);
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
            <Grid item key={asp.title} xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  title={asp.title}
                  titleTypographyProps={{ align: 'center' }}
                />
                <CardContent className={classes.relative}>
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
