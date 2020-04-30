import React, { Component } from 'react';
import Question from '../interfaces/Question.interface';
import { RouteComponentProps } from 'react-router-dom';
import { Container } from '@material-ui/core';

import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme, createStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
// import Avatar from '@material-ui/core/Avatar';
// import FolderIcon from '@material-ui/icons/Folder';
// import DeleteIcon from '@material-ui/icons/Delete';
// import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import emitter from '../interfaces/Emmiter';
import { FormikBag } from 'formik';
import CircularProgress from '@material-ui/core/CircularProgress';


import { QuestionForm, FormValues, MyFormProps } from './QuestionForm';


const useStyles = (theme: Theme) => createStyles({
    root: {
        flexGrow: 1,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    question_list: {
        display: 'block',
        width: '80%',
        margin: '0 10%'
    }
});

interface QuestionListState {
    questions: Question[] | [],
    question: Question | null,
    loaded: boolean
}

interface QuestionListProps extends RouteComponentProps<{ id: string }>, Question, WithStyles {

}


export class QuestionList extends Component<QuestionListProps, QuestionListState> {
    editButtonRef: React.RefObject<HTMLButtonElement>
    deleteButtonRef: React.RefObject<HTMLButtonElement>
    constructor(props: QuestionListProps) {
        super(props);
        this.editButtonRef = React.createRef();
        this.deleteButtonRef = React.createRef();
        this.state = {
            questions: [],
            question: null,
            loaded: false
        };
    }
    editButtonHandler = () => {
        if (this.props.editCallBack) {
            this.props.editCallBack({ ...this.props });
        }
        return void (0);
    };
    deleteButtonHandler = () => {
        if (this.props.deleteCallBack) {
            this.props.deleteCallBack({ ...this.props });
        }
        return void (0);
    };
    fetchQuestion = () => {
        const encode: string = window.btoa('jitender:DragonJason1@123456')
        fetch(`http://jitender1405.pythonanywhere.com/api/questions/?format=json&quiz=${this.props.match.params.id}`, { 'headers': { 'Authorization': 'Basic ' + encode }, })
            .then((resp: Response) => {
                if (resp.ok) {
                    return resp.json()
                }
            })
            .then(jsonData => {
                console.log(jsonData);
                this.setState({ questions: jsonData.results, loaded: true });
            })
            .catch(error => console.log(error));
    };
    componentDidMount = () => {
        if (this.state.questions.length === 0) {
            this.fetchQuestion();
        }
    }
    submitHandler = (values: FormValues, formikBag: FormikBag<MyFormProps, FormValues>) => {
        const url = `http://jitender1405.pythonanywhere.com/api/questions/?format=json&quiz=${this.props.match.params.id}`;
        const encode: string = window.btoa('jitender:DragonJason1@123456');
        fetch(url,
            {
                'headers': {
                    'Authorization': 'Basic ' + encode,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({ ...values, quiz: this.props.match.params.id }),
                'method': 'POST',
            })
            .then((resp: Response) => {
                if (resp.ok) {
                    return resp.json()
                }
            })
            .then((jsonData: Question) => {
                this.setState({ questions: [...this.state.questions, jsonData] });
                formikBag.resetForm();
                emitter.emit('displayMsg', { message: "Successfully Saved!", type: "SUCCESS" });


            })
            .catch(error => console.log(error));
    };

    render() {
        const { classes } = this.props;
        const questions = this.state.questions;
        return (
            <Container maxWidth="xl">
                <Grid container spacing={3} justify="center" alignItems="center">
                    <Grid item xs={12} className={classes.quizForm}>
                        <QuestionForm submitHandler={this.submitHandler} />
                    </Grid>

                    <Grid item xs={12}>

                        <Typography variant="h4" id="tableTitle" component="div">Question List</Typography>

                        <div className={classes.root}>
                            {
                                this.state.loaded ?
                                    (questions.length > 0 ? (questions as Array<Question>).map(({ id, question, question_answers }) =>

                                        <ExpansionPanel key={id}>
                                            <ExpansionPanelSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`panel${id}a-content`}
                                                id={`panel${id}a-header`}
                                            >
                                                <Typography className={classes.heading}>Q: {question}</Typography>
                                            </ExpansionPanelSummary>
                                            <ExpansionPanelDetails>
                                                <Typography className={classes.secondaryHeading}>Answers (Options):</Typography>
                                                <List dense={true} className={classes.question_list}>
                                                    {question_answers.map(({ answer, id, is_correct }, index) =>
                                                        <div key={id}>
                                                            <ListItem>
                                                                <ListItemText
                                                                    primary={answer}
                                                                />
                                                                <ListItemSecondaryAction>

                                                                    {is_correct ? <CheckIcon htmlColor="#00FF00" /> : <CloseIcon htmlColor="#FF0000" />}

                                                                </ListItemSecondaryAction>
                                                            </ListItem>
                                                            {((question_answers.length - 1) > index) && <Divider variant="fullWidth" component="li" />}
                                                        </div>
                                                    )}
                                                </List>
                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>
                                    )
                                        : <Typography variant="h6" id="tableTitle" component="div">No Question Available</Typography>
                                    )
                                    : <CircularProgress />
                            }
                        </div>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}


export default withStyles(useStyles)(QuestionList);
