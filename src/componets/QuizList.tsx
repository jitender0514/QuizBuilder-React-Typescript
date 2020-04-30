import React, { Component } from 'react';
import Quiz from '../interfaces/Quiz.interface';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const styles = {
    margin: {
        margin: '10px',
    }
}

export class QuizList extends Component<Quiz> {
    editButtonRef: React.RefObject<HTMLButtonElement>
    deleteButtonRef: React.RefObject<HTMLButtonElement>
    constructor(props: Quiz) {
        super(props);
        this.editButtonRef = React.createRef();
        this.deleteButtonRef = React.createRef();
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
    render() {
        const { id, title, description } = this.props;
        const questionLink = "/" + id + "/question";
        return (
            <TableRow>
                <TableCell>{id}</TableCell>
                <TableCell>{title}</TableCell>
                <TableCell>{description}</TableCell>
                <TableCell>
                    <div>
                        <Button ref={this.editButtonRef} style={styles.margin} variant="contained" color="primary" type="button" onClick={this.editButtonHandler}>Edit</Button>
                        <Button ref={this.deleteButtonRef} style={styles.margin} variant="contained" color="primary" type="button" onClick={this.deleteButtonHandler}>Delete</Button>
                        <Link to={questionLink}>View Question</Link>
                    </div>
                </TableCell>
            </TableRow>
        )
    }
}

export default QuizList;
