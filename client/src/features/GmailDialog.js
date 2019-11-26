import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

import imageEnabled from '../images/btn_google_signin_dark_normal_web.png';
import imageDisabled from '../images/btn_google_signin_dark_disabled_web.png';

import { getJWT } from '../utils';

const GET_AUTH_URL_URL = 'http://localhost:5000/gmail/get_auth_url';
const GET_GMAIL_ADDRESS_URL = 'http://localhost:5000/gmail/get_address';

const useStyles = makeStyles({
  imageContainer: {
    display: 'flex',
    justifyContent: 'center'
  }
});

function GmailDialog(props) {

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(imageDisabled);
  const [googleAuthURL, setGoogleAuthURL] = useState('');

  const getAuthURL = async () => {
    const response = await fetch(GET_AUTH_URL_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer: ${getJWT()}`
      }
    });
    if(response.status === 200) {
      return response.json()['auth_url'];
    }
    else {
      throw new Error('Could not get authorization URL from server.');
    }
  }

  const getUserGmail = async () => {
    const response = await fetch(GET_GMAIL_ADDRESS_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer: ${getJWT}`
      }
    });
    if(response.status === 200) {
      return response.json()['gmail_address'];
    }
    else {
      throw new Error('Could not get user\'s Gmail address from server');
    }
  }

  useEffect( () => {

    // check if the user has a connected gmail account
    getUserGmail()
    .then( (gmailAddress) => {

      //no connected gmail for this user
      if(!gmailAddress) {
        // open the dialog
        setOpen(true);
        // get the auth URL
        getAuthURL()
        .then( (authURL) => {
          setGoogleAuthURL(authURL);
          setImage(imageEnabled);
        })
        .catch( (e) => {
          console.log(e);
        });
      }
    })
    .catch( (e) => {
      console.log(e);
    });

  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog aria-labelledby="connect-gmail-account" 
            open={open}
            disableBackdropClick={true}
            >
      <DialogContent>
        <DialogTitle>Connect a Gmail Account</DialogTitle>
        <DialogContentText>
          Connect a gmail account access all of MailSender's features.
        </DialogContentText>
        <div className={classes.imageContainer}>
          <a onClick={(e) => image === imageDisabled ? e.preventDefault() : null} href={googleAuthURL}>
            <img src={image} alt="sign in with Google" />
          </a>
        </div>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Skip
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export default GmailDialog;