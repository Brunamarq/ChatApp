import firebase from '../FirebaseConnection';

export const getChatList = ( userUid, callback ) =>{
	return (dispatch) => {
		firebase.database().ref('users').child(userUid).child('chats').on('value', (snapshot)=>{
			let chats = [];

			snapshot.forEach((childItem) => {
				chats.push({
					key:childItem.key,
					title:childItem.val().title
				});

			});

			callback()

			dispatch ({
				type:'setChatList',
				payload:{
					chats:chats
				}
			});

		});
	};


};

export const getContactList = (userUid, callback) => {
    return (dispatch) => {

        firebase.database().ref('users').orderByChild('name').once('value').then((snapshot) =>{

            let users = [];
            snapshot.forEach((childItem) =>{

				if(childItem.key != userUid) {
					users.push({
						key:childItem.key,
						name:childItem.val().name
					});
				}
                
			});
			
			callback ()

            dispatch({
                type:'setContactList',
                payload:{
                    users:users
                }
            });
        });
    };
};

export const createChat = (userUid1, userUid2) => {
	return (dispatch) => {

			//CRIA O CHAT NO NÓ CHATS
		let newChat = firebase.database().ref('chats').push();
		newChat.child('members').child(userUid1).set({
			id:userUid1
		});
		newChat.child('members').child(userUid2).set({
			id:userUid2
		});

			//ASSOCIA OS ENVOLVIDOS NO CHAT EM USERS
		let chatId = newChat.key;

		firebase.database().ref('users').child(userUid2).once('value').then((snapshot)=>{
 			firebase.database().ref('users').child(userUid1).child('chats')
				.child(chatId).set({
					id:chatId,
					title:snapshot.val().name
			});
		});
		
		firebase.database().ref('users').child(userUid1).once('value').then((snapshot)=>{
			firebase.database().ref('users').child(userUid2).child('chats')
				.child(chatId).set({
					id:chatId,
					title:snapshot.val().name
			}) .then (() => {
				dispatch({
					type:'setActiveChat',
					payload:{
						chatid:chatId
					}
				});
			});
		});

	}

};

export const setActiveChat = (chatId) => {
	return {
		type:'setActiveChat',
		payload:{
			chatid:chatId
		}
	};
};

export const sendImage = (blob, callback) => {
	return(dispatch) =>{

		let tmpKey = firebase.database().ref('chats').push().key;

		alert("key gerado"+tmpKey);

		let fbimage = firebase.storage().ref().child('images').child(tmpKey);

		alert("começando upload...");
		
		fbimage.put(blob, {contentType:'image/jpeg'})
			.then(() => {

				alert("upload finalizado"),

				callback( tmpKey );

			})
			.catch((error) => {
				alert(error.code);
			});
	}
}

export const sendMessage = (msgType, msgContent, author, activeChat) => {
	return (dispatch) =>{
		let msgId = firebase.database().ref('chats').child(activeChat).child('messages').push();

		let currentDate = '';
		let cDate = new Date();

		currentDate = cDate.getFullYear()+'-'+(cDate.getMonth()+1)+'-'+cDate.getDate();
		currentDate +=' ';
		currentDate += cDate.getHours()+':'+cDate.getSeconds();

		switch(msgType){
			case 'text':
				msgId.set({
					msgType:'text',
					date:currentDate,
					m:msgContent,
					uid:author
				});
				break;
			case 'image':
				msgId.set({
					msgType:'image',
					date:currentDate,
					imgSource:msgContent,
					uid:author
				});
				break;
		};
		

	};
};

export const monitorChat = (activeChat) => {
	return (dispatch) => {
		firebase.database().ref('chats').child(activeChat).child('messages').orderByChild('date').on('value', (snapshot) =>{
		let arrayMsg = [];

		snapshot.forEach((childItem)=> {

			switch(childItem.val().msgType) {
				case 'text':
					arrayMsg.push ({
						key:childItem.key,
						date:childItem.val().date,
						msgType: 'text',
						m:childItem.val().m,
						uid:childItem.val().uid
					});
					break;
				case 'image':
					arrayMsg.push ({
						key:childItem.key,
						date:childItem.val().date,
						msgType: 'img',
						imgSource:childItem.val().imgSource,
						uid:childItem.val().uid
					});
					break;

			}
			
		});
		
		dispatch ({
			type:'setActiveChatMessage',
			payload: {
				'msgs':arrayMsg
			}
		});

		});
	};

};

export const monitorChatOff = (activeChat) => {
	return (dispatch) => {
		firebase.database().ref('chats').child(activeChat).child('messages').off('value');
	};
};

/*
export const SignInAction = (email, password) =>{
	return (dispatch) => {

		firebase.auth().signInWithEmailAndPassword(email, password)
			
			.then((user) =>{

				let uid = firebase.auth().currentUser.uid;

				dispatch ({
					type:'changeUid',
					payload:{
						uid:uid
					}
				});
			})
		
			.catch((error)=> {
				switch(error.code){
					case 'auth/invalid-email':
						alert("E-mail invalido. Tente novamente.");
						break;
					case 'auth/user-disabled':
						alert("Usuário desativado.");
						break;
					case 'auth/user-not-found':
						alert("Usuário não encontrado.");
						break;
					case ('auth/wrong-password'):
						alert("E-mail e/ou senha invalido.")
						break;
				}
			});
	};
};

*/


/*
export const changeName = (name) => {
	return {
		type:'changeName',
		payload: {
			name:name
		}
	};
};
*/