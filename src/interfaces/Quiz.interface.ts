export default interface Quiz {
    id?: number;
    title: string;
    description: string;
    editCallBack?: (quiz: Quiz) => void;
    deleteCallBack?: (quiz: Quiz) => void;
}