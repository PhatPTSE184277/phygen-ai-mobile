import './global.css';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/reduxs/store';
import AppNavigator from './src/navigators';
import Toast from 'react-native-toast-message';

import { NavigationContainer } from '@react-navigation/native';
import { linking, requestPushNotificationPermission } from './pushNotification';

export default function App() {
    useEffect(() => {
        requestPushNotificationPermission();
    }, []);

    return (
        <Provider store={store}>
            <NavigationContainer linking={linking}>
                <AppNavigator />
                <Toast />
            </NavigationContainer>
        </Provider>
    );
}
