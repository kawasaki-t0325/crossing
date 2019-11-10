import React from 'react';
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

const asps = [
  {
    title: 'A8.net',
  },
  {
    title: 'afb',
  },
  {
    title: 'もしもアフィリエイト',
  },
];

function App() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Container className={classes.container}>
        <Typography align="center" variant="h3">Crossing</Typography>
      </Container>
      <Container className={classes.main} component="main">
        <Grid container spacing={5} justify="center">
          {asps.map(tier => (
            <Grid item key={tier.title} xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={4}>
              <Card>
                <CardHeader
                  title={tier.title}
                  titleTypographyProps={{ align: 'center' }}
                />
                <CardContent>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    placeholder="ユーザー名"
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    placeholder="パスワード"
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
            />
            <Button className={classes.button} variant="contained" color="primary">
              検索する
            </Button>
          </div>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

export default App;
