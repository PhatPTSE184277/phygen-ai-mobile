import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import bg1 from '../../assets/images/bg1.png';
import googleIcon from '../../assets/images/gg.png';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ActivityIndicator } from 'react-native';
import axios from 'axios';

import facebookIcon from '../../assets/images/fb.png';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import axiosClient from '../apis/axiosClient';
const { width, height } = Dimensions.get('window');

const RegisterScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        // Simple validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Email',
                text2: 'Please enter a valid email address.',
                position: 'top',
            });
            return;
        }

        if (password.length < 6) {
            Toast.show({
                type: 'error',
                text1: 'Weak Password',
                text2: 'Password must be at least 6 characters long.',
                position: 'top',
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Password Mismatch',
                text2: 'Confirm password does not match.',
                position: 'top',
            });
            return;
        }

        try {
            setIsLoading(true);
            const response = await axiosClient.post('/api/auth/register', {
                email,
                password,
                confirmPassword
            });

            if (response.data.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Registration Successful',
                    text2: 'Please check your email for verification.',
                    position: 'top',
                });

                const res = await axios.post(
                    'https://backend-phygen.onrender.com/api/email_verification/request',
                    `"${email}"`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (res.data.success) {
                    navigation.navigate("OTPVerify", { email });
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: res.data.message,
                        position: 'top',
                    });
                }

            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Registration Failed',
                    text2: response.data.message,
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
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleSignIn = () => {
        navigation.navigate('Login');
    };

    return (
        <View className='flex-1 bg-gray-100 relative'>
            <StatusBar backgroundColor='#F3F4F6' barStyle='dark-content' />

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

            <View
                className='flex-row items-center mt-6 px-4 pt-12 pb-8'
                style={{ zIndex: 1 }}
            >
                <TouchableOpacity
                    onPress={handleGoBack}
                    className='flex-row items-center'
                >
                    <Text className='text-blue-500 text-base font-medium'>{`<< Go Back`}</Text>
                </TouchableOpacity>
            </View>


            <View className='flex-1 justify-center px-8' style={{ zIndex: 1 }}>

                <View className='items-center mb-12'>
                    <Text className='text-3xl font-bold text-gray-900 text-center'>
                        Register to create{'\n'}exams now.
                    </Text>
                </View>

                <View className='mb-4'>
                    <TextInput
                        className='bg-white px-4 py-4 rounded-2xl text-gray-700 shadow-sm'
                        placeholder='Enter Email'
                        placeholderTextColor='#9CA3AF'
                        value={email}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />
                </View>

                <View className='mb-4 relative'>
                    <TextInput
                        className='bg-white px-4 py-4 rounded-2xl text-gray-700 pr-12 shadow-sm'
                        placeholder='Enter Password'
                        placeholderTextColor='#9CA3AF'
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!isPasswordShow}
                    />
                    <TouchableOpacity
                        className='absolute right-4 top-4'
                        onPress={() => setIsPasswordShow(!isPasswordShow)}
                    >
                        <Feather
                            name={isPasswordShow ? 'eye-off' : 'eye'}
                            size={18}
                            color='#9CA3AF'
                        />
                    </TouchableOpacity>
                </View>

                <View className='mb-8 relative'>
                    <TextInput
                        className='bg-white px-4 py-4 rounded-2xl text-gray-700 pr-12 shadow-sm'
                        placeholder='Confirm Password'
                        placeholderTextColor='#9CA3AF'
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!isConfirmPasswordShow}
                    />
                    <TouchableOpacity
                        className='absolute right-4 top-4'
                        onPress={() =>
                            setIsConfirmPasswordShow(!isConfirmPasswordShow)
                        }
                    >
                        <Feather
                            name={isConfirmPasswordShow ? 'eye-off' : 'eye'}
                            size={18}
                            color='#9CA3AF'
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={handleRegister}
                    className='bg-blue-600 py-4 rounded-2xl mb-8'
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color='white' />
                    ) : (
                        <Text className='text-white text-center text-lg font-medium'>
                            Register
                        </Text>
                    )}
                </TouchableOpacity>

                <View className='flex-row items-center mb-6'>
                    <View className='flex-1 h-px bg-gray-300' />
                    <Text className='mx-4 text-gray-500 text-sm'>
                        Or continue with
                    </Text>
                    <View className='flex-1 h-px bg-gray-300' />
                </View>

                <View
                    className='flex-row justify-center'
                    style={{ gap: 24 }}
                >
                    <TouchableOpacity
                        className='bg-white w-28 h-16 rounded-2xl items-center justify-center'
                        style={{
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 3
                        }}
                    >
                        <Image
                            source={googleIcon}
                            style={{ width: 22, height: 20 }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className='bg-white w-28 h-16 rounded-2xl items-center justify-center'
                        style={{
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 3
                        }}
                    >
                        <Image
                            source={facebookIcon}
                            style={{ width: 22, height: 20 }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>

                <View className='items-center mt-8'>
                    <Text className='text-gray-600 text-sm text-center'>
                        Already have an account{'\n'}yet ?{' '}
                        <Text
                            onPress={handleSignIn}
                            className='text-blue-600 font-bold'
                        >
                            Sign In!
                        </Text>
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default RegisterScreen;