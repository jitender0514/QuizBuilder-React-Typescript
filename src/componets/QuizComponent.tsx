import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import QuizList from '../componets/QuizList';
import { FormikBag } from 'formik';
import { QuizForm, FormValues, MyFormProps } from '../componets/QuizForm';
import Quiz from '../interfaces/Quiz.interface';
import emitter from '../interfaces/Emmiter';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        quizForm: {
            backgroundColor: "#FFF",
        },
    }),
);

const QuizComponent: React.FC = () => {
    const [quizzes, setQuizzes] = useState<Array<Quiz>>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const classes = useStyles();
    const fetchQuizzes = () => {
        const encode: string = window.btoa('jitender:DragonJason1@123456')
        fetch('http://jitender1405.pythonanywhere.com/api/quizzes/?format=json', { 'headers': { 'Authorization': 'Basic ' + encode }, })
            .then((resp: Response) => {
                if (resp.ok) {
                    return resp.json()
                }
            })
            .then(jsonData => {
                setQuizzes(jsonData.results);
                setLoaded(true);
            })
            .catch(error => console.log(error));

    }
    const submitHandler = (values: FormValues, formikBag: FormikBag<MyFormProps, FormValues>) => {
        const url = quiz ? 'http://jitender1405.pythonanywhere.com/api/quizzes/' + quiz.id + '?format=json' : 'http://jitender1405.pythonanywhere.com/api/quizzes/?format=json';
        const encode: string = window.btoa('jitender:DragonJason1@123456');
        fetch(url,
            {
                'headers': {
                    'Authorization': 'Basic ' + encode,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify(values),
                'method': (quiz) ? 'PUT' : 'POST',
            })
            .then((resp: Response) => {
                if (resp.ok) {
                    return resp.json()
                }
            })
            .then(jsonData => {

                if (quiz) {
                    const list = quizzes.map((q) => {
                        if (q.id === jsonData.id) {
                            q = { ...jsonData };
                        }
                        return q;
                    })
                    setQuizzes(list);
                    setQuiz(null);
                    formikBag.resetForm();
                    emitter.emit('displayMsg', { message: "Successfully Updated!", type: "SUCCESS" });
                } else {
                    setQuizzes(currentQuizzes => [...currentQuizzes, jsonData]);
                    formikBag.resetForm();
                    emitter.emit('displayMsg', { message: "Successfully Saved!", type: "SUCCESS" });
                }
            })
            .catch(error => console.log(error));
    };
    const deleteQuizApi = (quiz: Quiz) => {
        const encode: string = window.btoa('jitender:DragonJason1@123456')
        fetch(`http://jitender1405.pythonanywhere.com/api/quizzes/${quiz.id}?format=json`,
            {
                'headers':
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + encode
                },
                'method': 'DELETE'
            })
            .then((resp: Response) => {
                if (resp.ok) {
                    const newQuizzes = quizzes.filter(obj => obj.id !== quiz.id);
                    emitter.emit('displayMsg', { message: "Successfully Deleted!", type: "SUCCESS" });
                    setQuizzes(newQuizzes);
                    // return resp.json()
                }
            })
            .catch(error => console.log(error));

    }
    const editQuiz = (quiz: Quiz) => {
        setQuiz(quiz);
    };
    const deleteQuiz = (quiz: Quiz) => {
        deleteQuizApi(quiz);
    };
    useEffect(() => {
        fetchQuizzes();
    }, [])

    return (
        <div >
            <Grid container spacing={3} justify="center"
                alignItems="center">
                <Grid item xs={12} className={classes.quizForm}>
                    {quiz ? <QuizForm initialId={quiz.id} initialTitle={quiz.title} initialDescription={quiz.description} submitHandler={submitHandler} /> : <QuizForm submitHandler={submitHandler} />}
                </Grid>
                <Grid item xs={10}>
                    {loaded
                        ? (quizzes.length > 0
                            ? (<TableContainer component={Paper}>
                                <Typography variant="h4" id="tableTitle" component="div">
                                    Quiz List
						</Typography>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Id</TableCell>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {
                                            quizzes.map(({ id, title, description }) =>
                                                <QuizList key={id} id={id} title={title} description={description} editCallBack={editQuiz} deleteCallBack={deleteQuiz} />
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>)
                            : <Typography variant="h6" id="tableTitle" component="div">No Quiz Available</Typography>
                        )
                        : <CircularProgress />
                    }

                </Grid>
            </Grid>

        </div>
    );
}

export default QuizComponent;
