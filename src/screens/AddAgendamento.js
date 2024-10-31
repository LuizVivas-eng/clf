import React, { Component } from "react";
import {
    Modal,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Platform
} from "react-native";

import axios from "axios";
import moment from "moment";
import { server, showError } from "../common";

/* Componentes */
import DateTimePicker from "@react-native-community/datetimepicker";
import commonStyles from "../commonStyles";

const initialState = {
    bloco: '', apartamento: '',
    date: (() => {
        const today = new Date();
        today.setUTCHours(3, 0, 0, 0); // Ajusta para o início do dia no horário de Brasília (UTC-3)
        return today;
    })(),
    showDatePicker: false,
    blockedDates: [],
}

export default class AddAgendamento extends Component {

    state = {
        ...initialState
    }

    componentDidUpdate(prevProps) {
        // Verifica se a prop isVisible mudou de false para true
        if (this.props.isVisible && !prevProps.isVisible) {
            this.fetchBlockedDates();
        }
    }

    fetchBlockedDates = async () => {
        try {
            const res = await axios.get(`${server}/agendamento/getAllAgendamentos`);
            const blockedDates = res.data.map(agendamento => moment(agendamento.dataAgendamento).format('YYYY-MM-DD'));
            this.setState({ blockedDates });
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
        }
    };

    save = () => {
        const newAgendamento = {
            bloco: this.state.bloco,
            apartamento: this.state.apartamento,
            date: moment(this.state.date).format('YYYY-MM-DD')
        }
        this.props.onSave && this.props.onSave(newAgendamento)
        this.setState({ ...initialState })
    }

    /*  getDatePicker = () => {
 
         let datePicker = <DateTimePicker
             value={this.state.date}
             onChange={(_, date) => {
                 date = date || this.state.date
                 this.setState({ date, showDatePicker: false })
             }}
             mode='date' />
 
         const dateString = moment(this.state.date).format('ddd, D [de] MMMM [de] YYYY')
 
         if (Platform.OS === 'android') {
             datePicker = <View>
                 <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>
                     <Text style={styles.date}>
                         {dateString}
                     </Text>
                 </TouchableOpacity>
                 {this.state.showDatePicker && datePicker}
             </View>
 
         }
         return datePicker
 
     } */

    isDateBlocked = (date) => {
        return this.state.blockedDates.includes(moment(date).format('YYYY-MM-DD'));
    };

    getDatePicker = () => {
        // Armazena a data temporária que o usuário está tentando selecionar
        const tempDate = this.state.showDatePicker ? this.state.date : new Date();
        
        return (
            <View>
                <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>
                    <Text style={styles.date} placeholderTextColor="#999">
                        {moment(this.state.date).format('ddd, D [de] MMMM [de] YYYY')}
                    </Text>
                </TouchableOpacity>
                {this.state.showDatePicker && (
                    <DateTimePicker
                        value={tempDate}
                        onChange={(_, date) => {
                            date = date || this.state.date;
                            if (!this.isDateBlocked(date)) {
                                this.setState({ date, showDatePicker: false });
                            } else {
                                alert('Esta data está indisponível. Selecione outra data.');
                            }
                        }}
                        mode='date'
                    />
                )}
            </View>
        );
    };
    
    render() {
        return (
            <Modal transparent={true} visible={this.props.isVisible} onRequestClose={this.props.onCancel} animationType="slide">
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background} />
                </TouchableWithoutFeedback>

                <View style={styles.container}>
                    <Text style={styles.header}>Agendar Lavanderia</Text>

                    {/* Campo do bloco */}
                    <TextInput style={styles.inputBloco} placeholder="Digite o bloco" onChangeText={bloco => this.setState({ bloco })} value={this.state.bloco} placeholderTextColor="#999" ></TextInput>

                    {/* Campo do apartamento */}
                    <TextInput style={styles.inputApartamento} placeholder="Digite o apartamento" onChangeText={apartamento => this.setState({ apartamento })} value={this.state.apartamento} placeholderTextColor="#999" ></TextInput>

                    {/* Chamar a função getDatePicker para selecionar a data */}
                    {this.getDatePicker()}


                    <View style={styles.buttons}>

                        <TouchableOpacity onPress={this.props.onCancel}>
                            <Text style={styles.button}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.save}>
                            <Text style={styles.button}>Salvar</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background} />
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    header: {
        fontFamily: commonStyles.fontFamily,
        backgroundColor: '#1e2221',
        color: commonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15,
        fontSize: 18,
    },
    button: {
        margin: 20,
        marginRight: 30,
        fontFamily: commonStyles.fontFamily,
        backgroundColor: '#1e2221',
        color: commonStyles.colors.secondary,
        padding: 10,
        fontSize: 20,
        borderRadius: 10
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    input: {
        padding: 10,
        marginTop: 20,
        fontFamily: commonStyles.fontFamily,
        height: 40,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6,
        color: '#000'
    },
    inputBloco: {
        padding: 10,
        marginTop: 20,
        marginHorizontal: 15,
        fontFamily: commonStyles.fontFamily,
        height: 40,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6,
        color: '#000'
    },
    inputApartamento: {
        padding: 10,
        marginTop: 20,
        fontFamily: commonStyles.fontFamily,
        height: 40,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6,
        marginBottom: 20,
        marginHorizontal: 15,
        color: '#000'
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 15,
        color: '#000',
        backgroundColor: '#edefef',
        padding: 10,
        borderRadius: 6,
        margin: 15
    }
})