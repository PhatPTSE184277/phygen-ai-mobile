// screens/VNPayPaymentScreen.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, Image } from 'react-native';
import Toast from 'react-native-toast-message';
import { WebView } from 'react-native-webview';
import axiosClient from '../apis/axiosClient';
import { Ionicons } from '@expo/vector-icons';
import bg1 from '../../assets/images/bg1.png';
import axios from 'axios'; // Ensure axios is imported for API calls
import { getFCMToken } from '../utils/pushNotification';

export default function VNPayPaymentScreen({ navigation }) {
    const [paymentUrl, setPaymentUrl] = useState(null);
    const [showWebView, setShowWebView] = useState(true);

    const createVNPayOrder = async () => {
        try {
            const response = await axiosClient.post('/api/Payment/create', {
                orderId: Date.now(),
                fullName: 'Nguyen Van A',
                amount: 599000,
                orderInfo: 'UpgradePremiumForUser:35',
                createdDate: new Date().toISOString()
            });

            if (response.data?.paymentUrl) {
                setPaymentUrl(response.data.paymentUrl);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Unable to create the payment request. Please try again later.',
                    position: 'top'
                });


            }
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Unable to create the payment request. Please try again later.',
                position: 'top'
            });

        }
    };

    useEffect(() => {
        createVNPayOrder();
    }, []);

    const handleNavigationChange = async (navState) => {
        const { url } = navState;

        if (url.includes('/api/Payment/vnpay-return')) {
            setShowWebView(false);

            const responseCode = new URL(url).searchParams.get('vnp_ResponseCode');
            const transactionStatus = new URL(url).searchParams.get('vnp_TransactionStatus');
            const success = responseCode === '00' && transactionStatus === '00';

            setTimeout(async () => {
                if (success) {
                    navigation.reset({ index: 0, routes: [{ name: 'HomeTabs' }] });

                    try {
                        const FCMToken = await getFCMToken();
                        await axios.post(
                            'https://backend-phygen.onrender.com/api/Notification/send-premium-success',
                            `"${FCMToken}"`,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            }
                        );
                    } catch (error) {
                        console.error('Notification send error:', error);
                    }
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Payment Failed',
                        text2: 'Your payment was not successful or was cancelled.',
                        position: 'top',
                    });
                    navigation.goBack();
                }
            }, 500);
        }
    };


    if (!paymentUrl) {
        return (
            <View className="flex-1 bg-gray-100 relative">
                <Image
                    source={bg1}
                    className="absolute left-0 right-0 bottom-0 w-full"
                    style={{ height: '80%', zIndex: 0 }}
                    resizeMode='cover'
                />
                <View className="flex-row items-center pt-12 pb-4 px-4 bg-white border-b border-gray-200 z-10">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
                        <Ionicons name="chevron-back-outline" size={28} color="#3B82F6" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-900">VNPay Payment</Text>
                </View>
                <View className="flex-1 justify-center items-center z-10">
                    <ActivityIndicator size="large" color="#6366F1" />
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-100 relative">
            <Image
                source={bg1}
                className="absolute left-0 right-0 bottom-0 w-full"
                style={{ height: '80%', zIndex: 0 }}
                resizeMode='cover'
            />
            {showWebView ? (
                <WebView
                    source={{ uri: paymentUrl }}
                    onNavigationStateChange={handleNavigationChange}
                    startInLoadingState
                    className="flex-1"
                    style={{ flex: 1, zIndex: 1, backgroundColor: 'transparent' }}
                />
            ) : (
                <View className="flex-1 justify-center items-center z-10 bg-white/80">
                    <ActivityIndicator size="large" color="#6366F1" />
                    <Text className="mt-4 text-base text-gray-700">Processing payment result...</Text>
                </View>
            )}
        </View>
    );
}
