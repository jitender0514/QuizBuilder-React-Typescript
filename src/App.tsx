import React, { useEffect, useRef } from 'react';
import { Route, Switch } from 'react-router-dom';
import QuestionList from './componets/QuestionList';
import { Container } from '@material-ui/core';
import Notification from './componets/common/Notifications';
import emitter from './interfaces/Emmiter';
import msgType from './interfaces/Common.Types';
import QuizComponent from './componets/QuizComponent';
import './App.css';

const App: React.FC = () => {
	const notificationRef = useRef<Notification>(null);
	useEffect(() => {
		if (!emitter.checkListenerExist('displayMsg')) {
			emitter.addListener('displayMsg', (payload: { message: string, type: msgType }) => {
				console.log(notificationRef);
				// alert(payload.message);
				if (notificationRef && notificationRef.current) {
					notificationRef.current.setMsg(payload.message, payload.type);
					notificationRef.current.onShow();
				}
			});
		}
	}, [])

	return (
		<Container maxWidth="xl">
			<div className="App">
				<Switch>
					<Route exact path="/" component={QuizComponent} />
					<Route exact path="/:id/question" component={QuestionList} />
				</Switch>
				<Notification ref={notificationRef} />
			</div>
		</Container>
	);
}

export default App;
