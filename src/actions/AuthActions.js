import firebase from '../FirebaseConnection';

export const SignOut = () => {
	firebase.auth().signOut();

	return {
		type:'changeStatus',
		payload: {
			status:2
		}
	};
};

export const checkLogin = () => {

	return (dispatch) => {

		firebase.auth().onAuthStateChanged((user) => {
			if(user) {
				dispatch({
					type:'changeUid',
					payload:{
						uid:user.uid
					}
				});
			} else {
				dispatch({
					type:'changeStatus',
					payload:{
						status:2
					}
				});
			}
		})

	}

};

//export const SignUpAction = (name, email, password, callback =>{
export const SignUpAction = ( callback =>{
	return (dispatch) => {
		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then((user) =>{

				let uid = firebase.auth().currentUser.uid;

				firebase.database().ref('users').child(uid).set({
					name:name
					
				});

				callback();

				dispatch ({
					type:'changeUid',
					payload:{
						uid:uid
					}
				});
			})

			.catch((error)=> {
				switch (error.code) {
					case 'auth/email-already-in-use':
						alert("E-mail já cadastrado. Insira outro e-mail");
						break;
					case 'auth/invalid-email':
						alert("E-mail inválido. Tente novamente.");
						break;
					case 'auth/operation-not-allowed':
						alert("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
						break;
					case 'auth/weak-password':
						alert("Senha fraca, tente utilizar números e caracteres especiais");
						break;
				}
				callback();
			});
	};
});

export const SignInAction = (email, password, callback) =>{
	return (dispatch) => {

		firebase.auth().signInWithEmailAndPassword(email, password)
			
			.then((user) =>{

				let uid = firebase.auth().currentUser.uid;

				callback();

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
				callback();
			});
	};
};

export const changeName = (name) => {
	return {
		type:'changeName',
		payload: {
			name:name
		}
	};
};

export const changeEmail = (email) => {
	return {
		type:'changeEmail',
		payload: {
			email:email
		}
	};
};

export const changePassword = (pass) => {
	return {
		type:'changePassword',
		payload: {
			pass:pass
		}
	};
};

