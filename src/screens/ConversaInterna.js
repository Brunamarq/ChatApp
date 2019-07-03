import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TextInput, StyleSheet, Image, TouchableHighlight, BackHandler,FlatList } from 'react-native';
import { connect } from 'react-redux';
import { setActiveChat, sendMessage, monitorChat, monitorChatOff, sendImage } from '../actions/ChatActions';
import  MensagemItem from '../components/ConversaInterna/MensagemItem';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

window.WMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = RNFetchBlob.polyfill.Blob;

export class ConversaInterna extends Component {

	static navigationOptions =({navigation}) => ({
		title:navigation.state.params.title,
		headerLeft: (
			<TouchableHighlight onPress={()=>{
				navigation.state.params.voltarFunction() }} underlayColor={false}>
				<Image source = { require('../../node_modules/react-navigation-stack/src/views/assets/back-icon.png') } style={{width:25, height:25, marginLeft:20}} />
			</TouchableHighlight>
		)
		
	})

	constructor(props) {
		super(props);
		this.state = {
			inputText:'',
			imageTmp:null		
		};

		this.voltar = this.voltar.bind(this);
		this.sendMsg = this.sendMsg.bind(this);
		this.chooseImage = this.chooseImage.bind(this);
	}

	componentDidMount() {
		this.props.navigation.setParams ({voltarFunction:this.voltar});
		BackHandler.addEventListener('hardwareBackPress', this.voltar);

		this.props.monitorChat(this.props.activeChat);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.voltar);

	}

	voltar() {
		this.props.monitorChatOff(this.props.activeChat) ;

		this.props.setActiveChat('');
		this.props.navigation.goBack();

		return true;
	}

	sendMsg() {
		let txt = this.state.inputText;

		let state = this.state;
		state.inputText = '';
		this.setState(state);

		
		this.props.sendMessage('text', txt, this.props.uid, this.props.activeChat);
	}

	chooseImage() {
		ImagePicker.showImagePicker(null, (r)=> {
			if(r.uri) {
				
				let uri = r.uri.replace('file://', '');

				RNFetchBlob.fs.readFile(uri, 'base64')
					.then((data) => {
						return RNFetchBlob.polyfill.Blob.build(data, {type:'image/jpeg;BASE64'});
					})
					.then((blob) => {

						alert("recebeu o blob");

						this.props.sendImage(blob,(imgName) => {

							alert("Imagem salva com sucesso!"+imgName);

						});
					});
			}
		});
	}

	render() {
		let AreaBehavior = Platform.select({ios:'padding', android:null});
		let AreaOffset = Platform.select({ios:64, android:null});
		return (
			<KeyboardAvoidingView style={styles.container} behavior={AreaBehavior} keyboardVerticalOffset={AreaOffset} >
				<FlatList 
					ref={(ref)=>{ this.chatArea = ref }}
					onContentSizeChange={()=>{this.chatArea.scrollToEnd({animate:true})}}
					onLayout={()=>{this.chatArea.scrollToEnd({animared:true})}}
					style={styles.chatArea}
					data={this.props.activeChatMessages}
					renderItem={({item})=><MensagemItem data={item} me={this.props.uid}/>}
				/>

				<View style={styles.imageTmp}>
					<Image source={this.state.imageTmp} style={styles.imageTmpImage} />
				</View>

				<View style={styles.sendArea}>
					<TouchableHighlight style={styles.imageButton} onPress={this.chooseImage}>
						<Image style={styles.imageBtnImage} source={require ('../assets/images/new_image.png')} />
					</TouchableHighlight>

					<TextInput style={styles.sendInput} value={this.state.inputText} onChangeText={(inputText)=>this.setState({inputText})} />
					<TouchableHighlight style={styles.sendButton} onPress={this.sendMsg}>
						<Image style={styles.sendImage} source={require('../assets/images/sendicon.png')} />
					</TouchableHighlight>
				</View>
			</KeyboardAvoidingView>
		);
	}

}

const styles = StyleSheet.create({
	container:{
		flex:1
	},
	chatArea:{
		flex:1,
		backgroundColor: '#e6e6fa'
	},
	sendArea:{
		height:50,
		backgroundColor:'#fff0f5',
		flexDirection:'row'
	},
	sendButton:{
		width:50,
		height:50,
		justifyContent:'center',
		alignItems:'center'
	},
	imageButton:{
		width:50,
		height:50,
		justifyContent:'center',
		alignItems:'center'
	},
	sendInput:{
		height:50,
		flex:1
	},
	sendImage:{
		width:40,
		height:40
	},
	imageBtnImage:{
		width:40,
		height:40
	},
	imageTmp: {
		height:100,
		backgroundColor:'#DDDDDD'
	},
	imageTmpImage:{
		width:100,
		height:100
	}
});

const mapStateToProps = (state) => {
	return {
		status:state.auth.status,
		uid:state.auth.uid,
		activeChat:state.chat.activeChat,
		activeChatMessages:state.chat.activeChatMessages
	};
};

const ConversaInternaConnect = connect(mapStateToProps, { setActiveChat, sendMessage, monitorChat, monitorChatOff, sendImage })(ConversaInterna);
export default ConversaInternaConnect;

