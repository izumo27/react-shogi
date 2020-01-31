import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface IConfirmProps{
  title: string;
  message: string;
  open: boolean;
  handleYes: () => void;
  handleNo: () => void;
}

export default function Confirm(props: IConfirmProps) {
  return (
    <div>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={props.open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleYes} color="primary">
            はい
          </Button>
          <Button onClick={props.handleNo} color="primary">
            いいえ
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
