import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import SelectFromList from './SelectFromList';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontWeight: 500,
    padding: 5,
  },
  select: {
    width: 200,
  },
  checkbox: {
    padding: 5,
    color: "#4FBE75"
  }
}));

const ExpandPanel = ({ getAllImportedFrom, importedFromList, actionType, placeholderValue, handleQueryTerm}) => {
  const classes = useStyles();
  const [checked, handleCheck] = useState(false);

  const handleExpand = () => {
    getAllImportedFrom()
    handleCheck(!checked)
  }

  return (
    <div className={classes.root}>
      <ExpansionPanel>
        
        <ExpansionPanelSummary
          onClick={() => handleExpand()}
        >
        {checked ? <div><CheckBoxIcon className={classes.checkbox} /></div>  : <div><CheckBoxOutlineBlankIcon className={classes.checkbox} /></div>}
          <Typography className={classes.heading}>{actionType}</Typography>
        </ExpansionPanelSummary>
        <SelectFromList
          className={classes.select}
          dataList={importedFromList}
          actionType={actionType}
          setValue={handleQueryTerm}
          currentValue={placeholderValue}
          >
        </SelectFromList>
      </ExpansionPanel>
    </div>
  );
}

export default ExpandPanel;