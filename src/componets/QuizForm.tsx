import React, { Component } from 'react';
// import * as Yup from 'yup';
// import Quiz from '../interfaces/Quiz.interface'
import Typography from '@material-ui/core/Typography';

import * as Yup from 'yup';
import { withFormik, FormikProps, Form, Field, FormikBag } from 'formik';
import { TextField } from 'formik-material-ui';
import { Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        div: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: 200,
            },
        },
    }),
);

// Shape of form values
export interface FormValues {
    title: string;
    description: string;
}

interface OtherProps {
    message?: string;
}

// Aside: You may see InjectedFormikProps<OtherProps, FormValues> instead of what comes below in older code.. InjectedFormikProps was artifact of when Formik only exported a HoC. It is also less flexible as it MUST wrap all props (it passes them through).
const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
    const { isSubmitting, message } = props;
    // console.log(props);
    const classes = useStyles();
    return (
        <Form className={classes.div}>
            <Typography variant="h4" id="tableTitle" component="div">{message}</Typography>
            <div>
                <Field component={TextField} label="Title" variant="outlined" name="title" size="small" />
            </div>
            <div>
                <Field component={TextField} label="Description" size="small" multiline variant="outlined" name="description" rows="4" cols="50" className="no-resize" />
            </div>
            <div>
                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                    Submit
                </Button>
            </div>
        </Form>
    );
};

// The type of props MyForm receives
export interface MyFormProps {
    initialTitle?: string;
    initialDescription?: string;
    initialId?: number;
    message?: string; // if this passed all the way through you might do this or make a union type

    submitHandler?: (values: FormValues, formikBag: FormikBag<MyFormProps, FormValues>) => void;
}

// Wrap our form with the withFormik HoC
const MyForm = withFormik<MyFormProps, FormValues>({
    // Transform outer props into form values
    mapPropsToValues: props => {
        // console.log(props, props.initialTitle || '');
        return {
            title: props.initialTitle || '',
            description: props.initialDescription || ''
        };
    },

    // Add a custom validation function (this can be async too!)
    // validate: (values: FormValues) => {
    //     let errors: FormikErrors<FormValues> = {};
    //     if (!values.title) {
    //         errors.title = 'Required';
    //     }
    //     return errors;
    // },

    validationSchema: Yup.object().shape({
        title: Yup.string()
            .min(3, "You must enter at-least 3 characters")
            .max(200, "You can't enter more than 200 characters")
            .required("Title is required"),
        description: Yup.string()
            .min(3, "You must enter at-least 3 characters")
            .max(400, "You can't enter more than 400 characters")
            .required("Description is required"),
    }),

    handleSubmit: (values, formikBag) => {
        // if (formikBag.)
        const m = formikBag.props.submitHandler;
        if (m !== undefined) { m(values, formikBag) }

        // console.log(values);
        // do submitting things
    },
    enableReinitialize: true
})(InnerForm);


export class QuizForm extends Component<MyFormProps> {
    render() {
        // const { id, title, description } = this.props;
        // console.log(this.props);
        return (
            <MyForm message="Quiz Form" {...this.props} />
        )
    }
}

export default QuizForm;