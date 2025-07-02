import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';

const bg1 = require('../../assets/images/bg1.png');
const { width, height } = Dimensions.get('window');
import { useRoute } from '@react-navigation/native';
import axiosClient from '~/apis/axiosClient';
import axios from 'axios'; // Ensure axios is imported for API calls

const ResetPass = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputs = useRef([]);
    const navigation = useNavigation();
    const route = useRoute();
    const { email } = route.params;
    const [timer, setTimer] = useState(30);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [isPasswordShow, setIsPasswordShow] = useState(false);

    useEffect(() => {
        if (inputs.current[0]) {
            inputs.current[0].focus();
        }
    }, []);


    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (text, index) => {
        if (/^[a-zA-Z0-9]$/.test(text)) {

            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);

            if (index < 5) {
                inputs.current[index + 1].focus();
            }
        } else if (text === '') {
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);
        }
    };

    const handleVerify = async () => {
        try {
            const code = otp.join('');
            console.log(password);
            const response = await axiosClient.post('/api/ForgetPassword/reset', {
                email: email,
                verificationCode: code,
                newPassword: password
            });
            if (response.data.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Verification Successful',
                    text2: 'Your password are change successfuly.',
                    position: 'top',
                });
                navigation.navigate('Login');
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Verification Failed',
                    text2: response.data.message || 'Invalid OTP. Please try again.',
                    position: 'top',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Verification Failed',
                text2: 'Please try again later.',
                position: 'top',
            });
        }
        finally {
            setLoading(true);
        }

    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleResend = async () => {
        if (timer === 0) {

            setTimer(30); // Reset timer

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
                navigation.navigate("ResetPass", { email });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: res.data.message,
                    position: 'top',
                });
            }
        }
    };

    // useEffect(() => {
    //     if (otp.every(char => char !== '')) {
    //         handleVerify();
    //     }
    // }, [otp]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 bg-white px-6 justify-center">
                <StatusBar barStyle='dark-content' backgroundColor="#FFFFFF" />

                <View className='absolute bottom-0 left-0 right-0' style={{ zIndex: 0 }}>
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

                {/* Back Button */}
                <TouchableOpacity
                    onPress={handleBack}

                    className="absolute top-16 left-4 w-32 h-14 rounded-full justify-center items-center"
                >
                    <Text className='text-blue-500 text-base font-medium'>{`<< Go Back`}</Text>
                </TouchableOpacity>

                <Text className="text-4xl font-bold text-center mb-4 mt-6">Almost there!</Text>
                <Text className="text-center text-gray-600 mb-8">
                    Please enter the 6-digit code sent to{"\n"}
                    <Text className="font-semibold">{email}</Text> to verify.
                </Text>


                {/* OTP Inputs */}
                <View className="flex-row justify-between mb-8 px-2">
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={ref => inputs.current[index] = ref}
                            value={digit}
                            onChangeText={text => handleChange(text, index)}
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === 'Backspace') {
                                    if (otp[index] === '' && index > 0) {
                                        inputs.current[index - 1].focus();
                                        const newOtp = [...otp];
                                        newOtp[index - 1] = '';
                                        setOtp(newOtp);
                                    }
                                }
                            }}
                            maxLength={1}
                            autoCapitalize="characters"
                            keyboardType="default"
                            className="border border-gray-300 w-12 h-12 rounded-lg text-center text-xl"
                            onSubmitEditing={() => {
                                if (index === 5) handleVerify(); // 👈 Gửi OTP khi nhấn Enter ở ô cuối
                            }}
                        />
                    ))}
                </View>

                <View className='mb-12 relative'>
                    <TextInput
                        className='bg-white px-4 py-4 rounded-2xl text-gray-700 pr-12 shadow-sm'
                        placeholder='••••••••'
                        placeholderTextColor='#9CA3AF'
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!isPasswordShow}
                        editable={!loading}
                    />
                    <TouchableOpacity
                        className='absolute right-4 top-4'
                        onPress={() => setIsPasswordShow(!isPasswordShow)}
                        disabled={loading}
                    >
                        <Feather
                            name={isPasswordShow ? 'eye-off' : 'eye'}
                            size={18}
                            color='#9CA3AF'
                        />
                    </TouchableOpacity>
                </View>

                {/* Confirm Button */}
                <TouchableOpacity
                    onPress={handleVerify}
                    className='bg-primary py-4 rounded-2xl mb-8'
                >
                    <View className='flex-row items-center justify-center'>
                        <Text className='text-text-button text-white text-center text-lg font-bold mr-1'>
                            VERIFY
                        </Text>

                    </View>

                </TouchableOpacity>


                <Text className="text-center text-text-title font-semibold mb-2">
                    Didn't receive the code?
                </Text>

                {timer > 0 ? (
                    <Text className="font-light text-text-title text-center">
                        Request a new code in 00:{timer < 10 ? `0${timer}` : timer} seconds
                    </Text>
                ) : (
                    <TouchableOpacity onPress={handleResend}>
                        <Text className="text-indigo-600 text-center font-medium">
                            Resend code
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableWithoutFeedback >
    );
};

export default ResetPass;
