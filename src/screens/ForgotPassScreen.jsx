import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';

import bg1 from '../../assets/images/bg1.png';
const { width, height } = Dimensions.get('window');
import Toast from 'react-native-toast-message';
import axios from 'axios';

const ForgotPassScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleContinue = async () => {

        if (!email) {

            Toast.show({
                type: 'error',
                text1: 'Missing Information',
                text2: 'Please enter your email address.',
                position: 'top',
            });
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post(
                'https://backend-phygen.onrender.com/api/ForgetPassword/request',
                `"${email}"`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (res.data.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: res.data.message,
                    position: 'top',
                });
                navigation.navigate('ResetPass', { email });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: res.data.message,
                    position: 'top',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong. Try again later.',
                position: 'top',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            className='flex-1 bg-white'
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className='flex-1 px-8 justify-center'>
                    <StatusBar barStyle='dark-content' backgroundColor="#FFFFFF" />
                    <View
                        className='absolute bottom-0 left-0 right-0'
                        style={{ zIndex: 0 }}
                    >
                        <Image
                            source={bg1}
                            style={{
                                width: width,
                                height: height * 0.8,
                                transform: [{ translateY: -height * 0 }]
                            }}
                            resizeMode='cover'
                        />
                    </View>
                    <TouchableOpacity
                        onPress={handleBack}

                        className="absolute top-16 left-4 w-32 h-14 rounded-full justify-center items-center"
                    >
                        <Text className='text-blue-500 text-base font-medium'>{`<< Go Back`}</Text>
                    </TouchableOpacity>
                    <View className='items-center mb-8'>
                        {/* <Image
                            source={forgotImage}
                            style={{ width: 180, height: 180 }}
                            resizeMode='contain'
                        /> */}
                    </View>

                    <View className='items-center mb-6'>
                        <Text className='text-2xl font-bold text-center text-text-title mb-2'>
                            Forgot Password?
                        </Text>
                        <Text className='text-base text-gray-600 text-center leading-5'>
                            Don’t worry, we’ll help you recover it right away!
                        </Text>
                    </View>

                    <View className='mb-6'>
                        <View className='relative'>
                            <TextInput
                                className='bg-white px-4 py-4 rounded-2xl text-gray-700 shadow-sm'
                                placeholder='Enter Email'
                                placeholderTextColor='#9CA3AF'
                                value={email}
                                onChangeText={setEmail}
                                keyboardType='email-address'
                                autoCapitalize='none'
                                onSubmitEditing={handleContinue}
                            />
                            <Ionicons
                                name='mail-outline'
                                size={20}
                                color='#9CA3AF'
                                className='absolute right-4 top-4'
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleContinue}
                        className='bg-blue-600 py-4 rounded-2xl mb-8'
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color='white' />
                        ) : (
                            <Text className='text-white text-center text-lg font-medium'>
                                Continue
                            </Text>
                        )}
                    </TouchableOpacity>
                    <View className='items-center'>
                        <Text className='text-gray-600 text-sm'>
                            Already a member?{' '}
                            <Text
                                onPress={handleLogin}
                                className='text-primary font-bold'
                            >
                                Log in
                            </Text>{' '}
                            now
                        </Text>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default ForgotPassScreen;
