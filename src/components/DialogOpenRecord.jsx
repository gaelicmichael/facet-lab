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

  const title = getField('title');
  const chorus = getField('first_line_chorus');
  const line1 = getField('first_line_verse');
  const structure = getField('structure');
  const classifications = getField('classifications');
  const subjects = getField('subjects');
  const origin = getField('place_of_origin');
  const community = getField('community');
  const authorFirst = getField('composer_first_name');
  const authorLast = getField('composer_last_name');
  const originalFormat = getField('original_format');
  const composedEra = getField('era_of_poetry');
  const online = getField('online_access');
  const notes = getField('notes_1');

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
            <b>Structure:</b> {structure}<br/>
            <b>Classifications:</b> {classifications}<br/>
            <b>Subjects:</b> {subjects}<br/>
            { (composedEra !== "") &&
            <>
                <b>Composed:</b> {composedEra}<br/>
            </> }
            <b>Origin:</b> {community ? community + ", " : ""} {origin}<br/>
            { (authorFirst !== "" || authorLast !== "") &&
            <>
                <b>Author:</b> {authorFirst} {authorLast}<br/>
            </> }
            <b>Original Format:</b> {originalFormat}<br/>
            { (online !== "") &&
            <>
                <b>Online At:</b> <a href="{online}">{online}</a><br/>
            </> }
            { (notes !== "") &&
            <>
                <b>Notes:</b> {notes}<br/>
            </> }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
    </Dialog>
  )
}