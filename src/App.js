import React, { useState } from 'react';
import {
  makeStyles,
  Container,
  TextField,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Button
} from "@material-ui/core";
import httpRequest from './modules/httpRequest';
import { SITE_IDS } from './config';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.grey[50],
    }
  },
  container: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  main: {
    marginTop: theme.spacing(4),
  },
  box: {
    display: 'flex',
    width: '50%',
  },
  button: {
    margin: 25,
    width: '20%',
    height: '50%',
  }
}));

function App() {
  const classes = useStyles();
  const [value, setValue] = useState({
    usernameA8: '',
    passwordA8: '',
    usernameAfb: '',
    passwordAfb: '',
    usernameMoshimo: '',
    passwordMoshimo: '',
  });
  const [word, setWord] = useState('');

  const asps = [
    {
      title: 'A8.net',
      usernameKey: 'usernameA8',
      passwordKey: 'passwordA8',
      username: value.usernameA8,
      passwordA8: value.passwordA8,
    },
    {
      title: 'afb',
      usernameKey: 'usernameAfb',
      passwordKey: 'passwordAfb',
      username: value.usernameAfb,
      password: value.passwordAfb,
    },
    {
      title: 'もしもアフィリエイト',
      usernameKey: 'usernameMoshimo',
      passwordKey: 'passwordMoshimo',
      username: value.usernameMoshimo,
      password: value.passwordMoshimo,
    },
  ];

  const search = async () => {
    const { usernameA8, usernameMoshimo, usernameAfb, passwordA8, passwordMoshimo, passwordAfb } = value;
    const a8Result = await httpRequest.httpRequest(SITE_IDS.A8, word, usernameA8, passwordA8);
    const afbResult = await httpRequest.httpRequest(SITE_IDS.A8, word, usernameAfb, passwordAfb);
    const moshimoResult =  await httpRequest.httpRequest(SITE_IDS.A8, word, usernameMoshimo, passwordMoshimo);
  };

  const changeText = event => {
    setValue({
      ...value,
      [event.target.name]: event.target.value
    });
  };

  return (
    <React.Fragment>
      <Container className={classes.container}>
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
              </Card>
            </Grid>
          ))}
          <div className={classes.box}>
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
            <Button className={classes.button} variant="contained" color="primary" onClick={search}>
              検索する
            </Button>
          </div>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

export default App;
