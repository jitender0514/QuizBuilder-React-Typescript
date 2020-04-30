import React, { Component } from 'react';
// import * as Yup from 'yup';
import Answer from '../interfaces/Answer.interface'
import Typography from '@material-ui/core/Typography';
import { Radio } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';


import * as Yup from 'yup';
import { withFormik, FormikProps, Form, Field, FormikBag } from 'formik';
import { TextField } from 'formik-material-ui';
import { Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import AlertDialog from './common/AlertComponent';
import Alert from '../interfaces/Alert.interface';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        div: {
            backgroundColor: theme.palette.common.white,
            padding: '20px 10px',
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '100%',
            },
        },
    }),
);

// Shape of form values
export interface FormValues {
    question: string;
    question_answers: [Answer, Answer, Answer, Answer] | [];
}

interface OtherProps {
    message?: string;
}

// Aside: You may see InjectedFormikProps<OtherProps, FormValues> instead of what comes below in older code.. InjectedFormikProps was artifact of when Formik only exported a HoC. It is also less flexible as it MUST wrap all props (it passes them through).
const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
    const { isSubmitting, message, values, setFieldValue } = props;
    const classes = useStyles();
    const options: number[] = [0, 1, 2, 3];

    // const changeHandler = (index: number) => {
    //     options.forEach(element => {
    //         if (element === index) {
    //             setFieldValue(`question_answers[${index}][is_correct]`, true)
    //         } else {
    //             setFieldValue(`question_answers[${element}][is_correct]`, false)
    //         }
    //     });
    // }

    return (
        <Form className={classes.div}>
            <Grid container spacing={1} justify="center"
                alignItems="center">
                <Grid item xs={8}>
                    <Typography variant="h4" id="tableTitle" component="div">{message}</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Field component={TextField} label="Question" variant="outlined" name="question" size="small" />
                </Grid>

                {options.map((index: number) =>
                    <React.Fragment key={index}>

                        <Grid item xs={6}>
                            <Field component={TextField}
                                label="Option"
                                size="small"
                                multiline
                                variant="outlined"
                                name={`question_answers[${index}][answer]`}
                                rows="2"
                                cols="50"
                                className="no-resize" />
                        </Grid>
                        <Grid item xs={2}>
                            <label>
                                <Field component={Radio}

                                    color='primary'
                                    name={`question_answers[${index}][is_correct]`}
                                    checked={values.question_answers[index]['is_correct']}
                                    onChange={() => {
                                        options.forEach((element: number) => {
                                            if (element !== index) {
                                                setFieldValue(`question_answers[${element}][is_correct]`, false, false);
                                                values.question_answers[element].is_correct = false;
                                            }
                                        });
                                        setFieldValue(`question_answers[${index}][is_correct]`, true);
                                        values.question_answers[index].is_correct = true;
                                    }}
                                    size="small" />
                                Is-Correct
                            </label>
                        </Grid>
                    </React.Fragment>

                )}

                <Grid item xs={8}>
                    <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                        Submit
                </Button>
                </Grid>
            </Grid>
        </Form>
    );
};

// The type of props MyForm receives
export interface MyFormProps {
    initialQuestion?: string;
    initialQuestionAnswers?: [Answer, Answer, Answer, Answer];
    initialId?: number;
    message?: string; // if this passed all the way through you might do this or make a union type
    children?: any;

    submitHandler?: (values: FormValues, formikBag: FormikBag<MyFormProps, FormValues>) => void;
    displayAlert?: (alert: Alert) => void;
}

// Wrap our form with the withFormik HoC
const MyForm = withFormik<MyFormProps, FormValues>({
    // Transform outer props into form values
    mapPropsToValues: props => {
        console.log(props);
        return {
            question: props.initialQuestion || '',
            question_answers: props.initialQuestionAnswers || [{ answer: "", is_correct: false }, { answer: "", is_correct: false }, { answer: "", is_correct: false }, { answer: "", is_correct: false }]
        };
    },
    validationSchema: Yup.object().shape({
        question: Yup.string()
            .min(3, "You must enter at-least 3 characters")
            .max(200, "You can't enter more than 200 characters")
            .required("Question is required"),
        question_answers: Yup.array().of(Yup.object().shape({
            answer: Yup.string()
                .min(1, "You must enter at-least 1 characters")
                .max(400, "You can't enter more than 400 characters")
                .required("Option is required")
        })),

    }),
    // validate: (values: FormValues) => {
    //     let errors: FormikErrors<FormValues> = {};
    //     let correctAns = 0;
    //     values.question_answers.forEach(ans => {

    //         if (ans.is_correct === true) {
    //             correctAns += 1;
    //         }
    //         console.log(ans.is_correct);
    //     });
    //     if (correctAns == 0) {
    //         errors.question_answers = 'Please choose a correct Option(Answer)';
    //     } else if (correctAns > 1) {
    //         errors.question_answers = 'You can select only one correct Option(Answer)';
    //     }
    //     console.log(errors);
    //     return errors;
    // },

    handleSubmit: (values, formikBag) => {
        // if (formikBag.)

        let correctAns: number = 0;
        values.question_answers.forEach(ans => {
            if (ans.is_correct === true) {
                correctAns += 1;
            }
        });
        if (correctAns === 0) {
            if (formikBag.props.displayAlert) {
                formikBag.props.displayAlert({ title: "No Option Selected", description: "Please choose a correct Option(Answer)" });
                formikBag.setSubmitting(false);
                return void (0);
            }
            // error = 'Please choose a correct Option(Answer)';
        } else if (correctAns > 1) {
            if (formikBag.props.displayAlert) {
                formikBag.props.displayAlert({ title: "Multiple Option Selected", description: "You can select only one correct Option(Answer)" });
                formikBag.setSubmitting(false);
                return void (0);
            }
            // error = 'You can select only one correct Option(Answer)';
        }
        const handler = formikBag.props.submitHandler;
        if (handler !== undefined) {
            handler(values, formikBag)
        }

        console.log(values);
        // do submitting things
    },
    enableReinitialize: true
})(InnerForm);


interface MyFormState {
    alertSettings: Alert
}

export class QuestionForm extends Component<MyFormProps, MyFormState> {
    AlertRef = React.createRef<AlertDialog>();
    constructor(props: MyFormProps) {
        super(props);
        // this.AlertRef = React.createRef<AlertDialog>();
        this.state = {
            alertSettings: { title: "", description: "" }
        };
        console.log(this.props);
    }
    showAlert = (alert: Alert) => {
        this.setState({ alertSettings: alert });
        // console.log(this.AlertRef)
        this.AlertRef.current?.openAlert();
    }
    componentDidMount() {
        console.log(this.props);
    }
    render() {
        return (
            <React.Fragment>
                <AlertDialog ref={this.AlertRef} {...this.state.alertSettings} />
                <MyForm message="Quiz Form" {...this.props} displayAlert={this.showAlert}>
                </MyForm>
            </React.Fragment>
        )
    }
}

export default QuestionForm;