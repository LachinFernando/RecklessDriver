import { Alert } from 'react-native';


const AlertDialog = props => {
    const {title, errorMessage} = props;

    return (
        Alert.alert(title, errorMessage, [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
        ])
    );
};

export default AlertDialog;
