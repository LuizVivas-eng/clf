import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import moment from 'moment';
import 'moment/locale/pt-br'

import commonStyles from "../commonStyles";

export default (props) => {
    /* console.warn('Executando o componente Agendamento', props) */

    const date = props.dataAgendamento
    const formattedDate = moment(date).locale('pt-br').format('ddd, D [de] MMMM');

    getRightContent = () => {
        return (
            <TouchableOpacity
                style={styles.right}
                onPress={() => props.onDelete && props.onDelete(props.id)}
            >
                <Icon name='trash' size={30} color='#FFF' />
            </TouchableOpacity>
        )
    }
    getLeftContent = () => {
        return (
            <View
                style={styles.left}>
                <Icon name='trash' size={20} color='#FFF' style={styles.excludeIcon} />
                <Text style={styles.excludeText}>Excluir</Text>
            </View>
        )
    }

    return (
        <GestureHandlerRootView>
            <Swipeable renderRightActions={getRightContent} renderLeftActions={getLeftContent}
                onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}
            >
                <View style={styles.container}>
                    <TouchableWithoutFeedback
                        onPress={() => props.toggleAgendamento(props.id)}
                    >
                        <View style={styles.checkContainer}>
                            {getCheckView()}
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.info}>
                        <Text style={styles.date}>{formattedDate}</Text>
                        <Text style={[styles.titulo]}>AGENDADO PARA:</Text>
                        <Text style={[styles.bloco]}>{props.bloco}</Text>
                        <Text style={[styles.bloco]}>{props.apartamento}</Text>
                    </View>

                </View>
            </Swipeable>
        </GestureHandlerRootView>
    )
}

function getCheckView() {
    return (
        <View style={styles.done}>
            <Icon name='check' size={13} color='#FFF'> </Icon>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#AAA',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#FFF'
    },
    checkContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '20%',
        aligItems: 'center',
        justifyContent: 'center'
    },
    checkImage: {
        width: 25,
        height: 25
    },
    pending: {
        height: 25,
        width: 25,
        borderWidth: 1,
        borderColor: '#AAA',
        padding: 5,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center'
    },
    done: {
        height: 25,
        width: 25,
        borderWidth: 1,
        borderColor: '#AAA',
        padding: 5,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4D7031',
        aligItems: 'center',
        justifyContent: 'center'
    },
    titulo: {
        fontWeight: 'bold',
        fontSize: 14,
        paddingLeft: 10,
        marginBottom: 2,
        color: commonStyles.colors.mainText
    },
    bloco: {
        fontSize: 16,
        paddingLeft: 10,
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 15,
        color: 'white',
        paddingHorizontal: 10,
        marginTop: 10,
        marginLeft: 10,
        letterSpacing: 0.5,
        lineHeight: 27,
        backgroundColor: '#4D7031',
        borderRadius: 5,
        height: 35,
        marginBottom: 6
    },
    right: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    },
    left: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',

    },
    excludeIcon: {
        marginLeft: 10
    },
    excludeText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        margin: 10
    }

})