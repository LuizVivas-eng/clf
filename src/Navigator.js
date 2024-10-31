/* import { createAppContainer, createSwitchNavigator } from 'react-navigation' */
/* import { createDrawerNavigator } from 'react-navigation-drawer' */


import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import commonStyles from './commonStyles'

/* Componentes */
import AuthOrApp from './screens/AuthOrApp'
import Auth from './screens/Auth'
import ListaDeAgendamentos from './screens/ListaDeAgendamentos'
import Menu from './screens/Menu'

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const menuConfig = {
    labelStyle: {
        fontFamily: commonStyles.fontFamily,
        fontWeight: 'normal',
        fontSize: 20,
    },
    activeTintColor: 'black',
    headerShown: false,
    activeBackgroundColor: '#42546a',
}

const DrawerNavigator = props => {
    /* const today = moment().locale('pt-br').format('ddd, D [de] MMMM') */
    const { email, name } = props.route.params
    return (
        <Drawer.Navigator
            screenOptions={menuConfig}
            drawerContent={(props) => <Menu {...props} email={email} name={name} />}
        >
            {/* Mês */}
            <Drawer.Screen name="Month" options={{ title: 'Mês' }}>
                {props => <ListaDeAgendamentos {...props} title='Mês' daysAhead={30} subTitle='Agendado para este mês' hojeOuAmanha={false} />}
            </Drawer.Screen>

            {/* Semana */}
            <Drawer.Screen name="Week" options={{ title: 'Semana' }}>
                {props => <ListaDeAgendamentos {...props} title='Semana' daysAhead={7} subTitle='Agendado para esta semana' hojeOuAmanha={false} />}
            </Drawer.Screen>

             {/* Amanhã */}
             <Drawer.Screen name="Tomorrow" options={{ title: 'Amanhã' }}>
                {props => <ListaDeAgendamentos {...props} title='Amanhã' daysAhead={1} subTitle='Agendado para amanhã' hojeOuAmanha={true} />}
            </Drawer.Screen>

            {/* Hoje */}
            <Drawer.Screen name="Today" options={{ title: 'Hoje' }}>
                {props => <ListaDeAgendamentos {...props} title='Hoje' daysAhead={0} subTitle='Agendado para hoje' hojeOuAmanha={true} />}
            </Drawer.Screen>

        </Drawer.Navigator>
    );
};

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AuthOrApp" component={AuthOrApp} />
            <Stack.Screen name="Auth" component={Auth} />
            <Stack.Screen name="Home" component={DrawerNavigator} />
            {/* <Stack.Screen name="Home" component={ListaDeAgendamentos} /> */}
        </Stack.Navigator>
    );
};


const Navigator = () => {
    return (
        <NavigationContainer>
            <AuthNavigator />
        </NavigationContainer>
    );
};

export default Navigator;