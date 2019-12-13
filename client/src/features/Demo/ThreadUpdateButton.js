import React, { useState } from 'react';
import CustomizedButton from '../CustomizedButton';
import { apiRequest } from '../../utils';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
  button: {
    float: 'right'
  }
});

const ThreadUpdateButton = () => {

  const [status, setStatus] = useState('Update Threads');

  const classes = useStyles();

  const triggerThreadUpdate = () => {
    apiRequest('GET', '/threads/update')
    .then( json => {
      console.log(json);
      setStatus('Updating...');
      setTimeout(pollStatus, 2000);
    })
    .catch( e => {
      console.log(e);
    });
  }

  const pollStatus = () => {
    apiRequest('GET', '/threads/status')
    .then( json => {
      console.log(json);
      if(json.status === 'complete') {
        console.log('thread update complete');
        setStatus('Done');
      }
      else {
        setTimeout(pollStatus, 2000);
      }
    })
    .catch( e => {
      console.log(e);
    });
  }

  return (
    <CustomizedButton 
      className={classes.button}
      onClick={triggerThreadUpdate} 
    >
      {status}
    </CustomizedButton>
  )
}

export default ThreadUpdateButton;