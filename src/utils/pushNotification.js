// pushNotification.js
import messaging from '@react-native-firebase/messaging';
import { Linking, PermissionsAndroid, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Các screen có thể điều hướng đến thông qua notification
const NAVIGATION_IDS = [
  'home',
  'explore',
  'notification',
  'account',
  'generate',
  'premium',
  'profile',
  'history',
  'dashboard',
  'summary',
  'hometabs',
];

// Tạo deep link từ dữ liệu notification
function buildDeepLinkFromNotificationData(data) {
  const navigationId = data?.navigationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId:', navigationId);
    return null;
  }
  return `phygen://${navigationId}`;
}

// Lưu FCM token vào AsyncStorage
const saveFCMToken = async (token) => {
  try {
    await AsyncStorage.setItem('fcm_token', token);
    console.log('FCM token saved:', token);
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};

// Lấy FCM token (ưu tiên từ AsyncStorage trước)
export const getFCMToken = async () => {
  try {
    const storedToken = await AsyncStorage.getItem('fcm_token');
    if (storedToken) {
      return storedToken;
    }

    const token = await messaging().getToken();
    if (token) {
      await saveFCMToken(token);
      return token;
    }

    return null;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Yêu cầu quyền push notification
export const requestPushNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert(
        'Quyền thông báo',
        'Vui lòng cấp quyền thông báo để nhận các cập nhật từ Phygen AI'
      );
      return false;
    }
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await getFCMToken();
    return token;
  } else {
    Alert.alert(
      'Quyền thông báo',
      'Vui lòng cấp quyền thông báo để nhận các cập nhật từ Phygen AI'
    );
    return false;
  }
};

// Xử lý khi nhận thông báo khi app đang mở (foreground)
export const handleForegroundNotification = (remoteMessage) => {
  console.log('[Foreground FCM]', remoteMessage);

  Alert.alert(
    remoteMessage.notification?.title || 'Phygen AI',
    remoteMessage.notification?.body || 'Bạn có thông báo mới',
    [
      { text: 'Đóng', style: 'cancel' },
      {
        text: 'Xem',
        onPress: () => {
          const navigationId = remoteMessage.data?.navigationId || 'hometabs';
          const url = `phygen://${navigationId}`;
          Linking.openURL(url);
        },
      },
    ]
  );
};

// Deep linking config cho React Navigation
export const linking = {
  prefixes: ['phygen://'],
  config: {
    screens: {
      // Auth screens
      Welcome: 'welcome',
      Login: 'login',
      Register: 'register',
      OTPVerify: 'otp-verify',
      ForgotPass: 'forgot-password',
      ResetPass: 'reset-password',

      // Main app screens
      HomeTabs: {
        path: 'hometabs',
        screens: {
          Home: 'home',
          Explore: 'explore',
          Notification: 'notification',
          Account: 'account',
        },
      },

      // Other screens
      Premium: 'premium',
      Generate: 'generate',
      Summary: 'summary',
      Profile: 'profile',
      History: 'history',
      Dashboard: 'dashboard',
      VNPayPayment: 'vnpay-payment',
    },
  },

  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url) return url;

    const message = await messaging().getInitialNotification();
    return buildDeepLinkFromNotificationData(message?.data);
  },

  subscribe(listener) {
    const handleURL = ({ url }) => listener(url);

    const linkSub = Linking.addEventListener('url', handleURL);

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('[Background FCM]', remoteMessage);
      // Bạn có thể lưu thông báo vào local ở đây nếu muốn
    });

    const foregroundUnsubscribe = messaging().onMessage(handleForegroundNotification);

    const notificationOpenedUnsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('[Notification Opened App]', remoteMessage);
      const navigationId = remoteMessage.data?.navigationId || 'hometabs';
      const url = `phygen://${navigationId}`;
      listener(url);
    });

    return () => {
      linkSub.remove();
      foregroundUnsubscribe();
      notificationOpenedUnsubscribe();
    };
  },
};
