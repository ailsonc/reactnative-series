import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import FormRow from '../components/FormRow';

export default class LoginPage extends React.Component {
    render() {
        return (
            <View>
                <FormRow> 
                    <TextInput style={styles.input} placeholder="Email" />
                </FormRow>
                <FormRow> 
                    <TextInput style={styles.input} secureTextEntry placeholder="Password"/>
                </FormRow> 
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        paddingLeft: 5,
        paddingRight: 5,
        //paddingBottom: 10
    }
});