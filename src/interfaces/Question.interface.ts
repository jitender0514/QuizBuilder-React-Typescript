import Answer from './Answer.interface'

export default interface Question {
    id?: number;
    question: string;
    quiz?: number;
    question_answers: [Answer, Answer, Answer, Answer],
    editCallBack?: (question: Question) => void;
    deleteCallBack?: (question: Question) => void;

}