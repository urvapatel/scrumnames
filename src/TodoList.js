import React, {Component, useState} from "react";
import axios, { all } from 'axios';
import TodoItems from "./TodoItems";

export default function TodoList() {
		const [token, setToken] = useState('');
		const [webexUrl, setWebexUrl] = useState('https://ibm.webex.com/meet/urva.patel'); //change to hosts webex
		const [names, setNames] = useState([]);
		let namesSet = new Set();
		const [originalSet, setOriginalSet] = useState(namesSet);
		// this.state = {items: [], meetingLink: "", userToken: ""};
		// this.addItem = this.addItem.bind(this);
		// this.updateToken = this.updateToken.bind(this);
		// this.getAtendees = this.getAtendees.bind(this);
		// this.deleteItem = this.deleteItem.bind(this);

	const updateToken = (e) => {
		setToken(e.target.value);
	}

	const updateWebexUrl = (e) => {
		setWebexUrl(e.target.value);
	}

	const getAtendees = () => {
			console.log("the token", token)
			console.log("the url", webexUrl)

			const AuthStr = 'Bearer '.concat(token); 
			axios.get(`https://webexapis.com/v1/meetings?webLink=${webexUrl}`, { headers: { Authorization: AuthStr } })
			.then(response => {
				// If request is good...
				console.log(response.data?.items[0]?.id);
				let id = response.data?.items[0]?.id;
				axios.get(`https://webexapis.com/v1/meetingParticipants?meetingId=${id}`, { headers: { Authorization: AuthStr } })
				.then(response => {
					// If request is good...
					let newNames = [];
					let allNames = [];
					for(let i = 0; i < response.data.items.length; i++) {
						if(!originalSet.has(response.data?.items[i]?.displayName)){
							originalSet.add(response.data?.items[i]?.displayName)
							newNames.push({
								text: `${response.data?.items[i]?.displayName}`, 
								key: `${response.data?.items[i]?.displayName}`
							})
						}
						console.log("orig set", originalSet)
						setOriginalSet(originalSet)
						
					}

					console.log(newNames);

					newNames = shuffle(newNames)
					allNames = [...names, ...newNames]

					console.log(allNames);
					setNames(allNames);
					

				})
				.catch((error) => {
					console.log('error ' + error);
				});
			})
			.catch((error) => {
				console.log('error ' + error);
			});

			let shuffle = (a) => {
				for (let i = a.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[a[i], a[j]] = [a[j], a[i]];
				}
				return a;
			}
		
	}

	// const addItem = (e) => {
	// 	if(this._inputElement.value !== ""){
	// 		var newItem = {
	// 			text: this._inputElement.value, 
	// 			key: Date.now()
	// 		};
	
	// 		this.setState((prevState) => {
	// 			return {
	// 				items: prevState.items.concat(newItem)
	// 			};
	// 		});
		
	// 		this._inputElement.value = "";
	// 	}
	// 	console.log(this.state.items);
	// 	e.preventDefault();
	// }

	const deleteItem = (key) => {
		var filteredItems = names.filter(function(item) {
			return (item.key !== key);
		});
		
		setNames(filteredItems);
	}

	return(
		<div className="todoListMain">
			<div className="header">
			token:
			<input
				type="password"
				id="token"
				name="token"
				onChange={updateToken}
				value={token}
			/>
			url:
			<input
				type="text"
				id="webexUrl"
				name="webexUrl"
				onChange={updateWebexUrl}
				value={webexUrl}
			/>
			<button className="button" onClick={getAtendees}>Update</button>

			
			<TodoItems entries={names} delete={deleteItem} />
			</div>
		</div>
	);
	
}
