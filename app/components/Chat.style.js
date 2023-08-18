import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10
    },
    messageBox: {
        padding: 10,
        borderRadius: 5,
        marginVertical: 5
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#e1ffc7'
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#e9e9e9'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    input: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        marginRight: 10,
        padding: 5,
        borderRadius: 5
    }
});
export default styles