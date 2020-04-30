import React, { Component } from 'react';
import CSS from 'csstype';
import msgType from '../../interfaces/Common.Types';
// import { string } from 'yup';

const notification: CSS.Properties = {
    padding: '16px',
    position: "fixed",
    zIndex: 999,
    right: '16px',
    transition: 'top 0.3s ease'
};

interface styleState {
    top: string;
}
export class Notification extends Component<{}, styleState> {
    timeout: null | ReturnType<typeof setTimeout> = null;
    msg: { message: string, type: msgType } = { message: "", type: "SUCCESS" };
    cssProperty: CSS.Properties = notification;
    constructor(props: {}) {
        super(props);
        this.state = {
            top: '-100px'
        }
        this.timeout = null;
    }

    setMsg = (msg: string = "", type: msgType = "SUCCESS") => {
        this.msg.message = msg;
        this.msg.type = type;
    }

    onShow = () => {
        if (this.timeout) {
            clearInterval(this.timeout);
            this.setState({ top: '-100px' }, () => {
                this.timeout = setTimeout(() => {
                    this.showNotificaion();
                }, 300);
            });
        } else {
            this.showNotificaion();
        }
    }
    showNotificaion = () => {
        this.setState({ top: '16px' }, () => {
            this.timeout = setTimeout(() => {
                this.setState({ top: '-100px' });
            }, 3000)
        });
    };

    getCssProperty = () => {
        switch (this.msg.type) {
            case "ERROR":
                this.cssProperty.backgroundColor = "rgb(253, 236, 234)";
                this.cssProperty.color = "rgb(97, 26, 21)";
                break;
            case "SUCCESS":
                this.cssProperty.backgroundColor = "rgb(237, 247, 237)";
                this.cssProperty.color = "rgb(30, 70, 32)";
                break;
            case "WARNING":
                this.cssProperty.backgroundColor = "rgb(255, 244, 229)";
                this.cssProperty.color = "rgb(102, 60, 0)";
                break;
            case "INFO":
                this.cssProperty.backgroundColor = "rgb(232, 244, 253)";
                this.cssProperty.color = "rgb(13, 60, 97)";
                break;
            default:
                break;
        }
        return this.cssProperty;
    }

    render() {
        const topStyle = { ...this.getCssProperty(), top: this.state.top };
        return (
            <div style={topStyle}>{this.msg.message}</div>
        )
    }
}

export default Notification;
