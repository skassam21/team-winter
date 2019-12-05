import React, { Fragment, useState, useEffect } from 'react';
import { 
  makeStyles,
  Container,
  Button
 } from '@material-ui/core';

import NavBar from '../features/NavBar/MainBody';
import CampaignSummary from '../features/Campaign/CampaignSummary';
import StepDialog from '../features/Campaign/StepDialog';
import ConfirmationDialog from '../features/ConfirmationDialog';
import { getJWT } from '../utils';

const useStyles = makeStyles( () => ({
  container: {
    marginTop: '100px'
  },
  mt1b3: {
    marginTop: '1rem',
    marginBottom: '3rem'
  }
}));

// sample campaign, data to be removed
const emptyCampaign = {
  id: 1,
  title: 'My First Campaign',
  userName: 'John Doe',
  prospectsTotal: 234,
  prospectsContacted: 123,
  prospectsReplied: 34,
  steps: [
    {
      id: 1,
      templateId: 1,
      templateName: 'First template',
      sent: 123,
      replied: 23
    }
  ],
}


const emptyStep = {
  templateId: ''
}

const Campaign = (props) => {

  const classes = useStyles();

  const [campaign, setCampaign] = useState(emptyCampaign);
  const [editOpen, setEditOpen] = useState(false);
  const [editStep, setEditStep] = useState({});
  const [newOpen, setNewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [templateId, setTemplateId] = useState(0);
  const [emailTemplates, setEmailTemplates] = useState([{}]);

  useEffect( () => {
    getCampaign();
    getEmailTemplates();
  }, []);

  const findStepIndex = (step) => {
    for(let i=0; i<campaign.steps.length; i++) {
      if(campaign.steps[i].id === step.id) return i;
    }
    return -1;
  }

  const findTemplate = (id) => {
    for(let template of campaign.templates) {
      if(template.id === id) return template;
    }
    return {};
  }

  const createStepObject = stepData => {
    return {
      id : stepData.id,
      templateId : stepData.email_template.id,
      templateName : stepData.email_template.name,
      sent : 100,
      replied : 25
    }
  }

  const handleCampaign = data => {
    const campaign = data.campaign;
    const stepsData = campaign.steps;
    const steps = [];
    for(let stepData of stepsData) {
      const step = createStepObject(stepData);
      steps.push(step);
    }

    setCampaign(
      {
        id : campaign.id,
        title : campaign.name,
        userName : campaign.owner_name,
        prospectsTotal : campaign.prospects,
        prospectsContacted : 20,
        prospectsReplied : 10,
        steps : steps
    })
  }

  const getCampaign = async () => {
    const id = props.match.params.id;
    await fetch(`/campaigns/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getJWT()}`
      }
    })
    .then(res => res.json())
      .then(data => {
        handleCampaign(data)
      })
    .catch(err => {
      console.log(err.message);
    });
  }

  const handleEmailTemplates = data => {
    const emailTemplatesData = data.email_templates;
    const emailTemplates = [];
    for(let emailTemplate of emailTemplatesData) {
      emailTemplates.push({
        id : emailTemplate.id,
        name : emailTemplate.name,
        type : emailTemplate.type,
        subject : emailTemplate.subject,
        body : emailTemplate.body
      })
    }
    setEmailTemplates(emailTemplates);
  }

  const getEmailTemplates = async () => {
    await fetch('/email_templates', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getJWT()}`
      }
    })
    .then(res => res.json())
      .then(data => {
        handleEmailTemplates(data)
      })
    .catch(err => {
      console.log(err.message);
    });
  }

  const updateStep = (step) => {
    console.log('Update: ' + JSON.stringify(step));
    // update UI
    const idx = findStepIndex(step);
    campaign.steps[idx].templateId = step.templateId;
    campaign.steps[idx].templateName = findTemplate(step.templateId).name;
    setCampaign(campaign);
    
    /** 
     * TODO:
     * update server
     * update template_id on step with id=step.id
     */
  }

  const addNewStep = async () => {
    const id = campaign.id;
    const data = {
      id : templateId
    }
    await fetch(`/campaign/${id}/steps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${getJWT()}`
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
      .then(data => createStepObject(data.step))
        .then(step => {
          const newCampaign = Object.assign({}, campaign);
          newCampaign.steps.push(step);
          setCampaign(newCampaign);
        })
    .catch(err => {
      console.log(err.message);
    });
  }

  const deleteStep = () => {
    console.log('Delete: ' + JSON.stringify(editStep));
    setConfirmOpen(false);
    setEditOpen(false);
    // update UI
    const idx = findStepIndex(editStep);
    campaign.steps.splice(idx, 1);
    setCampaign(campaign);

    /**
     * TODO:
     * update server
     * delete step with id=editStep.id
     */
  }
//---------------Edit Step-----------------------//
  const handleEditOpen = (idx) => {
    setEditStep(campaign.steps[idx]);
    setEditOpen(true);
  }

  const handleEditClose = () => {
    setEditOpen(false);
  }

  const handleEditSave = () => {
    updateStep(editStep);
    setEditOpen(false);
  }

  const handleSetEditStep = (newStep) => {
    setEditStep(newStep);
  }
//-----------------Create Step-----------------------//
  const handleNewOpen = () => {
    setNewOpen(true);
  }

  const handleNewClose = () => {
    setNewOpen(false);
  }

  const handleNewSave = () => {
    addNewStep();
    setNewOpen(false);
  }

  const handleDelete = () => {
    setConfirmOpen(true);
  }

  const confirmClose = () => {
    setConfirmOpen(false);
  }


  return (
    <Fragment>
      <NavBar />
      <Container className={classes.container}>
        {/* Page headings, campaign summary, and steps display */}
        <CampaignSummary title={campaign.title}
                         userName={campaign.userName}
                         prospects={campaign.prospectsTotal}
                         contacted={campaign.prospectsContacted}
                         replied={campaign.prospectsReplied}
                         steps={campaign.steps}
                         openEditStepDialog={handleEditOpen} />
        {/* Edit dialog */}
        <StepDialog title="Edit Step"
                    open={editOpen}
                    onClose={handleEditClose}
                    onSave={handleEditSave}
                    step={editStep}
                    setStep={handleSetEditStep}
                    delete={true}
                    onDeleteClick={handleDelete}
                    templates={emailTemplates} />
        {/* New step dialog */}
        <StepDialog title="New Step"
                    open={newOpen}
                    onClose={handleNewClose}
                    onSave={handleNewSave}
                    // step={newStep}
                    delete={false}
                    // setStep={handleSetNewStep}
                    setTemplateId={setTemplateId}
                    
                    templates={emailTemplates} />
        <Button onClick={handleNewOpen} className={classes.mt1b3} variant="outlined">Add Step</Button>
        <ConfirmationDialog open={confirmOpen}
                            onClose={confirmClose}
                            onConfirm={deleteStep} />
      </Container>
    </Fragment>
  )
}

export default Campaign;