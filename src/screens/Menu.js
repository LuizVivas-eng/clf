import React from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { CommonActions } from '@react-navigation/native';
import { Gravatar } from 'react-native-gravatar'
import commonStyles from '../commonStyles'


import axios from 'axios'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome'

export default props => {
    
    const logout = () => {
        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'Auth',
                    },
                ],
            })
        )
    }

    return (
        <DrawerContentScrollView>
            <SafeAreaView style={styles.header}>
                <Text style={styles.title}>Lavanderia</Text>
                <Gravatar style={styles.avatar}
                    options={{
                        email: props.email,
                        secure: true
                    }} />

                <View style={styles.userInfo}>
                    <Text style={styles.name}>
                        {props.name}
                    </Text>
                    <Text style={styles.email}>
                        {props.email}
                    </Text>
                </View>

                <TouchableOpacity onPress={logout}>
                    <View style={styles.logoutIcon}>
                        <Icon name='sign-out' size={30} color='#42546a' />
                    </View>
                </TouchableOpacity>

            </SafeAreaView>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderColor: '#DDD'
    },
    title: {
        color: '#000',
        fontFamily: commonStyles.fontFamily,
        fontSize: 30,
        paddingTop: 30,
        padding: 10
    },
    avatar: {
        width: 60,
        height: 60,
        borderWidth: 3,
        borderRadius: 30,
        margin: 10,
        backgroundColor: '#42546a'
    },
    userInfo: {
        marginLeft: 15,
    },
    name: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        color: commonStyles.colors.mainText,
        marginBottom: 5,
    },
    email: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 15,
        color: commonStyles.colors.subText,
        marginBottom: 10,
    },
    logoutIcon: {
        marginLeft: 15,
        marginBottom: 10
    }
})