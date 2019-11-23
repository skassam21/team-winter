import React, { Fragment } from 'react';
import { Link} from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ActionButton from '../ActionButton';

const useStyles = makeStyles(() => ({
  navText: {
    flexGrow: 10,
    color: "grey",
    fontSize: "12",
  },
  buttonText: {
    color: "black",
    textDecoration: "none",
  }
}));

const SignUpFeatures = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <Typography className={classes.navText}>
        Already have an account?
      </Typography>
      <ActionButton> <Link className={classes.buttonText} to="/login">Log in</Link> </ActionButton>
    </Fragment>
  );
}

export default SignUpFeatures;