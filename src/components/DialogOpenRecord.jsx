// Dialog that displays Song entry

import React, { useContext, useEffect, useRef } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { FacetContext } from '../data-modules/FacetedDBContext';

export default function DialogOpenRecord(props) {
  const { open, handleClose, ids } = props;

  const [state] = useContext(FacetContext);

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  // ASSUMES a single ID
  const theID = ids ? ids[0] : null;
  const dbInterface = state.dbInterface;
  const theRecord = theID ? dbInterface.findObjectByField('ai', theID) : null;

  function getField(fieldName) {
    return theRecord ? theRecord[fieldName] : "";
  }

  let title = getField('title');
  let chorus = getField('first_line_chorus');
  let line1 = getField('first_line_verse');
  let classifications = getField('classifications');
  let subjects = getField('subjects');
  let origin = getField('place_of_origin');
  let community = getField('community');
  let authorFirst = getField('composer_first_name');
  let authorLast = getField('composer_last_name');
  let originalFormat = getField('original_format');
  let online = getField('online_access');

  return (
    <Dialog open={open} onClose={handleClose}
        scroll="paper" fullWidth={true} maxWidth="md"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Title: {title}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
            { (chorus !== "") &&
            <>
                <b>Chorus:</b> {chorus}<br/>
            </> }
            { (line1 !== "") &&
            <>
                <b>First Line:</b> {line1}<br/>
            </> }
            <b>Classifications:</b> {classifications}<br/>
            <b>Subjects:</b> {subjects}<br/>
            <b>Origin:</b> {community ? community + ", " : ""} {origin}<br/>
            { (authorFirst !== "" || authorLast !== "") &&
            <>
                <b>Author:</b> {authorFirst} {authorLast}<br/>
            </> }
            <b>Original Format:</b> {originalFormat}<br/>
            { (online !== "") &&
            <>
                <b>Online At:</b> <a href="{online}">{online}</a>
            </> }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
    </Dialog>
  )
}