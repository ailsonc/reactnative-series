import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import FormRow from '../components/FormRow';
import firebase from 'firebase';


export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mail: '',
            password: '',
            isLoading: false,
            message: ''
        }
    }

    componentDidMount() {
        const firebaseConfig = {
            apiKey: "AIzaSyDpzg1Q8Z2mOSQ1mXyf5y8JBE04ZgIZ_ZY",
            authDomain: "react-series-2020.firebaseapp.com",
            databaseURL: "https://react-series-2020.firebaseio.com",
            projectId: "react-series-2020",
            storageBucket: "react-series-2020.appspot.com",
            messagingSenderId: "363221885181",
            appId: "1:363221885181:web:a68bf0ad62e5f614c9de94"
        };

        !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
        
    }

    onChangeHandler(field, value) {
        this.setState({ [field]: value });
    }

    tryLogin() {
        this.setState({ isLoading: true, message: '' });
        const { mail, password } = this.state;
        
        const loginUserSuccess = user => {
            this.setState({ message: 'Sucesso!' });
            this.props.navigation.navigate('Main');
        }

        const loginUserFailed = error => {
            console.log("Error", error)
            this.setState({ message: this.getMessageByErrorCode(error, error.code) });
        }

        firebase
        .auth()
        .signInWithEmailAndPassword(mail, password)
        .then(loginUserSuccess)
        .catch( error => {
            if (error.code === 'auth/user-not-found') {
                Alert.alert(
                    "Usuário não encontrado",
                    "Deseja criar um cadastro com as informações inseridas?",
                    [
                        {
                          text: "Não",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel" // IOS Style
                        },
                        { text: "Sim", onPress: () => {
                            firebase
                            .auth()
                            .createUserWithEmailAndPassword(mail, password)
                            .then(loginUserSuccess)
                            .catch(loginUserFailed(error));

                        } }
                    ],
                    { cancelable: false }
                );
                return
            };

            loginUserFailed(error);

        })
        .then(() => this.setState({ isLoading: false }));

    }

    renderButton() {
        if (this.state.isLoading)
            return <ActivityIndicator/>;

        return (
            <Button title="Entrar" onPress={() => this.tryLogin() }/> 
        )
    }

    getMessageByErrorCode(message, errorCode) {
        console.log(message, errorCode);
        switch(errorCode) {
            case 'auth/wrong-password':
                return 'A senha é inválida ou o usuário não tem uma senha';
            case 'auth/user-not-found':  
                return 'Usuário não encontrado'; 
            case 'auth/invalid-email':
                return 'O endereço de email está mal formatado';  
            case 'auth/too-many-requests':
                return 'Muitas tentativas de login sem êxito. Por favor, tente novamente mais tarde';        
            default:
                return 'Erro desconhecido'; 
        }
    }

    renderMessage() {
        const { message } = this.state;

        if(!message)
            return null;

        return (
            <View>
                <Text>
                    { message }
                </Text>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <FormRow first> 
                    <TextInput style={styles.input} value={this.state.mail} onChangeText={value => this.onChangeHandler('mail',value)} placeholder="Email"/>
                </FormRow>
                <FormRow last> 
                    <TextInput style={styles.input} value={this.state.password} onChangeText={value => this.onChangeHandler('password',value)} secureTextEntry placeholder="Password"/>
                </FormRow>
                { this.renderButton() }
                { this.renderMessage() }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    input: {
        paddingLeft: 5,
        paddingRight: 5,
        //paddingBottom: 10
    }
});