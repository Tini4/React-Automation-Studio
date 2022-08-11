import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const DeleteAreaDialog = (props) => {
    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
        >
            <DialogTitle >{"Confirm area deletion"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {`Are you sure you want to delete ${props?.data?.index?.includes("=") ? 'subArea' : 'area'} ${props?.data?.areaName}?`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="secondary">
                    No
                </Button>
                <Button onClick={props.handleDelete} color="primary">
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(DeleteAreaDialog);