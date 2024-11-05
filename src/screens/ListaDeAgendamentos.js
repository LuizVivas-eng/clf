import React, { Component } from "react";
import { View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform, Alert, SafeAreaView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // Importar o DateTimePicker

import axios from "axios";

/* Estilização */
import commonStyles from "../commonStyles";

/* Imagens */
import todayImage from '../../assets/imgs/today.jpg'
import tomorrowImage from '../../assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/imgs/week.jpg'
import monthImage from '../../assets/imgs/month.jpg'
import criativo from '../../assets/imgs/criativo.jpg'

/* Libs */
import { server, showError } from "../common";
import moment from 'moment';
import 'moment/locale/pt-br'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

/* Componentes */
import Agendamento from "../components/Agendamento";
import AddAgendamento from "./AddAgendamento";

const initialState = {
    showDoneAgendamentos: true,
    visibleAgendamentos: [],
    showAddAgendamento: false,
    agendamentos: [],
    showDatePicker: false, // Adicionar o estado do DatePicker
    selectedDate: new Date(), // Data padrão
}
export default class ListaDeAgendamentos extends Component {

    state = {
        ...initialState
    }

    // Função para abrir o DatePicker
    openDatePicker = () => {
        this.setState({ showDatePicker: true });
    };

    onDateChange = async (event, selectedDate) => {

        if (event.type === "dismissed") {
            this.setState({ showDatePicker: false });
            return;
        }

        const date = selectedDate || this.state.selectedDate;
        this.setState({ showDatePicker: false, selectedDate: date });

        if (date) {
            try {
                const formattedDate = moment(date).format('YYYY-MM-DD');
                const res = await axios.post(`${server}/agendamento/getAgendamentoParse`, {
                    data: { data: formattedDate }
                });
                if (res.data.result.length > 0) {
                    const { apartamento, bloco } = res.data.result[0]
                    Alert.alert(
                        "🚫 Data Indisponível",
                        `Lavanderia agendada para: ${apartamento} | ${bloco}.`,
                        [
                            {
                                text: "Consultar Nova Data",
                                onPress: () => this.setState({ showDatePicker: true }),
                            },
                            {
                                text: "Fechar",
                                style: "cancel",
                            },
                        ]
                    );
                } else {
                    Alert.alert(
                        "✅ Data Disponível",
                        "Nenhum agendamento encontrado para esta data. A data está disponível.",
                        [
                            {
                                text: "Fazer Agendamento",
                                onPress: () => this.setState({ showAddAgendamento: true }),
                            },
                            {
                                text: "Consultar Nova Data",
                                onPress: () => this.setState({ showDatePicker: true }),
                            },
                            {
                                text: "Fechar",
                                style: "cancel",
                            },
                        ]
                    );
                }
            } catch (e) {
                showError(e);
            }
        }
    };


    componentDidMount = async () => {
        const stateString = await AsyncStorage.getItem('stateAgendamento')
        const savedState = JSON.parse(stateString) || initialState
        this.setState({
            showDoneAgendamentos: savedState.showDoneAgendamentos
        }, this.filterAgendamentos)

        this.loadAgendamentos()

        // Listener para o evento de foco
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.loadAgendamentos();
        });
    }

    loadAgendamentos = async () => {
        try {
            let endpoint = '';

            if (this.props.hoje) {
                endpoint = `${server}/hoje`;
            } else if (this.props.amanha) {
                endpoint = `${server}/amanha`;
            } else if (this.props.semana) {
                endpoint = `${server}/semana`;
            } else if (this.props.mes) {
                endpoint = `${server}/mes`;
            }

            if (endpoint) {
                const res = await axios.get(endpoint);

                /* if (res.data[0]?.dataAgendamento ?? false) {
                    const [data, hora] = res.data[0].dataAgendamento.split('T'); res.data[0].dataAgendamento = data;
                } */

                     res.data = res.data.map(item => {
                        if (item.dataAgendamento) {
                            const [data] = item.dataAgendamento.split('T');
                            item.dataAgendamento = data;
                        }
                        return item;
                    });

                this.setState({ agendamentos: res.data }, this.filterAgendamentos);
            } else {
                console.warn('Nenhum filtro foi selecionado!');
            }
        } catch (e) {
            showError(e);
        }
    };


    filterAgendamentos = () => {

        this.setState({ visibleAgendamentos: this.state.agendamentos })
        AsyncStorage.setItem('stateAgendamento', JSON.stringify({ showDoneAgendamentos: this.state.showDoneAgendamentos }))
    }

    addAgendamento = async newAgendamento => {
        if (!newAgendamento.bloco || !newAgendamento.bloco.trim()) {
            Alert.alert('Dados Incompletos', 'Bloco não informado!')
            return
        }
        if (!newAgendamento.apartamento || !newAgendamento.apartamento.trim()) {
            Alert.alert('Dados Incompletos', 'Apartamento não informado!')
            return
        }

        try {
            await axios.post(`${server}/agendamento`, {
                bloco: newAgendamento.bloco,
                apartamento: newAgendamento.apartamento,
                dataAgendamento: newAgendamento.date
            })

            this.setState({ showAddAgendamento: false }, this.loadAgendamentos)

        } catch (e) {
            showError(e)
        }

    }

    deleteAgendamento = async agendamentoId => {
        try {
            await axios.delete(`${server}/agendamento/${agendamentoId}`)
            this.loadAgendamentos()
        } catch (e) {
            showError(e)
        }
    }

    getImage = () => {
        switch (this.props.daysAhead) {
            case 0: return todayImage
            case 1: return tomorrowImage
            case 7: return weekImage
            default: return monthImage
        }
    }
    getColor = () => {
        switch (this.props.daysAhead) {
            case 0: return commonStyles.colors.today
            case 1: return commonStyles.colors.tomorrow
            case 7: return commonStyles.colors.week
            default: return commonStyles.colors.month
        }
    }
    render() {
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')
        return (
            <SafeAreaView style={styles.container}>
                <AddAgendamento isVisible={this.state.showAddAgendamento}
                    onCancel={() => this.setState({ showAddAgendamento: false })}
                    onSave={this.addAgendamento} />
                <ImageBackground source={this.getImage()} style={styles.background}>


                    <View style={styles.iconBar}>

                        {/* Icone do drawer navigation */}
                        <TouchableOpacity onPress={this.props.navigation.openDrawer}>
                            <Icon name='bars' size={35} color={commonStyles.colors.secondary}></Icon>
                        </TouchableOpacity>

                        {/* Ícone de lupa para abrir o diálogo de seleção de data */}
                        <TouchableOpacity onPress={this.openDatePicker}>
                            <Icon name="search" size={35} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>

                    </View>
                    <View style={styles.titleBar}>

                        <Text style={styles.title}>{this.props.title}</Text>
                        <Text style={styles.subTitle}>{this.props.subTitle}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.listaDeAgendamentos}>
                    <FlatList
                        data={this.state.visibleAgendamentos}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({ item }) => <Agendamento {...item}
                            onDelete={this.deleteAgendamento}
                        />}
                    />

                    {this.state.visibleAgendamentos.length === 0 && (
                        <ImageBackground source={criativo} style={styles.noDataBackground}>
                            <Text style={styles.noDataText}>Nenhum agendamento disponível.</Text>
                        </ImageBackground>
                    )}

                </View>
                <TouchableOpacity activeOpacity={0.7}

                    style={
                        [
                            styles.addButton,
                            { backgroundColor: this.getColor() }
                        ]
                    }
                    onPress={() => this.setState({ showAddAgendamento: true })}>
                    <Icon name="plus" size={20} color={commonStyles.colors.secondary} />
                </TouchableOpacity>

                {/* DatePicker */}
                {this.state.showDatePicker && (
                    <DateTimePicker
                        value={this.state.selectedDate}
                        mode="date"
                        display="default"
                        onChange={this.onDateChange}
                    />
                )}

            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 3,
    },
    listaDeAgendamentos: {
        flex: 7
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20
    },
    subTitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'space-between',
        marginTop: Platform.OS === 'ios' ? 40 : 10
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noDataBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        resizeMode: 'cover', // Ajusta a imagem ao tamanho da tela
    },
    noDataText: {
        position: 'absolute',
        bottom: 100, // Ajuste a margem inferior conforme necessário
        fontSize: 20,
        color: '#42546a',
        textAlign: 'center',
        fontFamily: commonStyles.fontFamily,
        paddingHorizontal: 20,
    },
})
