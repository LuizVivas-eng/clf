import { Alert, Platform } from "react-native";

/* const server = Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000' */
/* const server = 'https://7d02-2804-3d28-41-17e2-1593-4d1-20f3-b978.ngrok-free.app' */

const server = 'https://clbr-production.up.railway.app'

function showError(err) {
    if(err.response && err.response.data) {
        Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${err.response.data}`)
    } else {
        Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${err}`)
    }
}

function showSuccess(msg) {
    Alert.alert('Sucesso!', msg)
}

export { server, showSuccess, showError }