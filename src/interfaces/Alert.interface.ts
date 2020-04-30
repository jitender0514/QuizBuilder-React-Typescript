export default interface Alert {
    title?: string;
    description?: string;
    closeBtnText?: string;
    closeCallBack?: () => void;
}