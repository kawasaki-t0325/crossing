import React from "react";
import {
  makeStyles,
  Card,
  CardHeader,
  CardContent,
  Link,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";
import { RESPONSE_STATUS } from "../config";

const useStyles = makeStyles(() => ({
  relative: {
    position: 'relative',
  },
  textWarning: {
    color: '#d50000'
  }
}));

function AspInput(props) {
  const classes = useStyles();
  const { asp } = props;

  return (
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
          {asp.result.message} {asp.result.count && <span>{asp.result.product.length}/{asp.result.count}件表示</span>}
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
  );
}

export default AspInput