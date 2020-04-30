import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '../../interfaces/Alert.interface';
import { styled } from '@material-ui/core/styles';


const StyledDialog = styled(Dialog)({
    '& .MuiPaper-root': {
        backgroundColor: "rgb(253, 236, 234)",
        color: "#f51919"
    },
    '& .MuiTypography-colorTextSecondary': {
        color: "#d05a52"
    }
});

interface AlertDialogState {
    open: boolean;
}



export class AlertDialog extends React.Component<Alert, AlertDialogState> {
    constructor(props: Alert) {
        super(props);
        this.state = { open: false };
    }

    openAlert = () => {
        this.setState({ open: true });
    }

    closeAlert = () => {
        this.setState({ open: false });
    }
    render() {
        return (
            <div>
                <StyledDialog
                    open={this.state.open}
                    onClose={this.closeAlert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.props.description}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" size="small" onClick={this.closeAlert} color="primary" autoFocus>
                            Okay
                    </Button>
                    </DialogActions>
                </StyledDialog>
            </div>

        )
    }
}

// export default AlertDialog
export default AlertDialog;