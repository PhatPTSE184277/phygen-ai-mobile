import './global.css';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/reduxs/store';
import AppNavigator from './src/navigators';
import Toast from 'react-native-toast-message';
import {
    requestPushNotificationPermission,
    getFCMToken,
} from './src/utils/pushNotification';
import { Linking } from 'react-native';
export default function App() {
    useEffect(() => {
        // Khởi tạo push notification khi app bắt đầu
        const initializePushNotifications = async () => {
            try {
                const permission = await requestPushNotificationPermission();
                if (permission) {
                    const token = await getFCMToken();
                    console.log('[FCM Token]:', token); // ✅ Log FCM token tại đây
                }
            } catch (error) {
                console.error('Error initializing push notifications:', error);
            }
        };

        initializePushNotifications();
    }, []);
    const handleDeepLink = ({ url }) => {
        console.log('🔗 [Foreground deep link]:', url);
    };

    const sub = Linking.addEventListener('url', handleDeepLink);

    // ✅ Kiểm tra deep link khi app được mở từ trạng thái killed
    Linking.getInitialURL().then((url) => {
        if (url) {
            console.log('🚀 [Initial deep link]:', url);
        }
    });
    return (
        <Provider store={store}>
            <AppNavigator />
            <Toast />
        </Provider>
    );
}
