import React, { Component } from 'react'
import {
    ImageBackground,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Alert
} from 'react-native'

import axios from 'axios'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from '@react-navigation/native';

import backgroundImage from '../../assets/imgs/login.jpg'
import commonStyles from '../commonStyles'
import AuthInput from '../components/Authinput'


import { server, showError, showSuccess } from '../common'

const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stageNew: false
}

export default class Auth extends Component {

    state = {
        ...initialState
    }

    signinOrSignup = () => {
        if (this.state.stageNew) {
            this.signup()
        } else {
            this.signin()
        }
    }

    signup = async () => {
        try {
            const res = await axios.post(`${server}/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword,
            })

            
            /* Se caiu aqui não chegou no catch */
            showSuccess('Usuário cadastro!')
            this.setState({ ...initialState })

        } catch (e) {
            Alert.alert('Erro', e.response ? e.response.data : e.message)
            showError(e)
        }
    }

    signin = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password
            })

            AsyncStorage.setItem('userData', JSON.stringify(res.data))
            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            /* this.props.navigation.navigate('Home', res.data) */
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Home',
                            params: res.data,
                        },
                    ],
                })
            )
        } catch (e) {
            showError(e)
        }
    }

    render() {

        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)

        if (this.state.stageNew) {
            validations.push(this.state.name && this.state.name.trim().length >= 3)
            validations.push(this.state.password === this.state.confirmPassword)
        }

        const validForm = validations.reduce((all, v) => all && v)

        return (
            <ImageBackground source={backgroundImage} style={styles.background}>
                <Text style={styles.title}>Lavanderia</Text>

                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>{this.state.stageNew ? 'Crie a sua conta' : 'Informe seus dados'}</Text>
                    {this.state.stageNew &&
                        <AuthInput
                            icon='user'
                            placeholder='Nome'
                            style={styles.input}
                            value={this.state.name}
                            onChangeText={name => this.setState({ name })}
                        />
                    }
                    <AuthInput
                        icon='at'
                        placeholder='Email'
                        style={styles.input}
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                    />
                    <AuthInput
                        icon='lock'
                        placeholder='Senha'
                        style={styles.input}
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                        secureTextEntry={true}
                    />

                    {this.state.stageNew &&
                        <AuthInput icon='asterisk'
                            placeholder='Confirmação de Senha'
                            value={this.state.confirmPassword}
                            style={styles.input} secureTextEntry={true}
                            onChangeText={confirmPassword => this.setState({ confirmPassword })} />
                    }
                    <TouchableOpacity
                        disabled={!validForm}
                        onPress={this.signinOrSignup}
                    >
                        <View style={[styles.button, !validForm && { backgroundColor: '#AAA' }]}>

                            <Text style={styles.buttonText}>{this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.setState({ stageNew: !this.state.stageNew })}
                        style={{ padding: 10 }}>
                        <Text style={styles.buttonText}>{this.state.stageNew ? 'Já tem uma conta?' : 'Ainda não possui uma conta?'}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 60,
        marginBottom: 10
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        width: '90%'
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
        color: 'black',
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 7
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    }
})