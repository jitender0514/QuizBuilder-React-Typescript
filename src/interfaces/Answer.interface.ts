export default interface Answer {
    id?: number;
    question?: number;
    answer: string;
    is_correct: boolean;
    editCallBack?: (answer: Answer) => void;
    deleteCallBack?: (answer: Answer) => void;
}