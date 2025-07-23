import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../apis/axiosClient';
import { addAuth, authSelector } from '../reduxs/reducers/authReducer';
import { useAuthLogic } from '../utils/authLogic';
import Toast from 'react-native-toast-message';
import bg1 from '../../assets/images/bg1.png';
import googleIcon from '../../assets/images/gg.png';
import facebookIcon from '../../assets/images/fb.png';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as WebBrowser from "expo-web-browser";
import auth from '@react-native-firebase/auth';
WebBrowser.maybeCompleteAuthSession();
const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { isFirstTimeUse, setFirstTimeUsed } = useAuthLogic();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const authData = useSelector(authSelector);
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "1044921846734-3ce05ftg8pmrbc6kdhhhqbh2o125mv3n.apps.googleusercontent.com",
            offlineAccess: true,
        });
    }, []);

    const signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signOut();
            const userInfo = await GoogleSignin.signIn();
            console.log('[Google User Info]:', userInfo);
            // const idToken = userInfo.data.idToken;

            // const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            const idToken = await auth().currentUser.getIdToken();

            if (idToken) {
                handleGoogleLogin(idToken);
            }

        } catch (error) {
            console.error('[❌ Google Signin Error]', error);
        }
    };





    const handleGoogleLogin = async (idToken) => {

        try {
            setIsLoading(true);
            const res = await axiosClient.post('/api/Auth/login/google', { idToken });
            if (res.data.success) {
                console.log(res.data.data.user.username);
                const expiresIn = res.data.data.expiresIn;
                const expiryTime = new Date().getTime() + expiresIn * 1000;
                const authData = {
                    token: res.data.data.token,
                    expiryTime: expiryTime,
                    _id: res.data.data.user.id || '',
                    username: res.data.data.user.username || "",
                    email: res.data.data.user.email || "",
                    emailVerified: true,
                    role: res.data.data.user.role || "user",
                    isFirstTimeUse: false
                };
                await AsyncStorage.setItem('Auth_Data', JSON.stringify(authData));
                dispatch(addAuth(authData));
                if (isFirstTimeUse) {
                    await setFirstTimeUsed();
                }
                Toast.show({
                    type: 'success',
                    text1: 'Login Successful!',
                    text2: `Welcome back, ${res.data.data.user.username}!`,
                    position: 'top'
                });
            } else {
                throw new Error('Google login failed');
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Google Login Failed',
                text2: error.message || 'Something went wrong',
                position: 'top'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (authData.token) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeTabs' }]
            });
        }
    }, [authData.token]);

    useEffect(() => {
        if (authData.token) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeTabs' }]
            });
        }
    }, [authData.token]);

    const handleLogin = async () => {
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: 'Missing Information',
                text2: 'Please enter both email and password',
                position: 'top'
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await axiosClient.post('/api/Auth/login', {
                identifier: email.trim(),
                password: password
            });
            console.log('Login response:', response.data);

            if (response.data.success) {
                const expiresIn = response.data.data.expiresIn;
                const expiryTime = new Date().getTime() + expiresIn * 1000;

                const authData = {
                    token: response.data.data.token,
                    expiryTime: expiryTime,
                    _id: response.data.data.user.id || '',
                    username: response.data.data.user.username,
                    email: response.data.data.user.email,
                    emailVerified: response.data.data.user.emailVerified,
                    accountType: response.data.data.user.accountType,
                    role: response.data.data.user.role,
                    isFirstTimeUse: false,
                    refreshToken: response.data.data.refreshToken,

                };

                await AsyncStorage.setItem(
                    'Auth_Data',
                    JSON.stringify(authData)
                );
                dispatch(addAuth(authData));
                if (isFirstTimeUse) {
                    await setFirstTimeUsed();
                }

                Toast.show({
                    type: 'success',
                    text1: 'Login Successful!',
                    text2: 'Welcome back!',
                    position: 'top'
                });

            } else {
                let errorMessage = 'Login failed';

                if (response.data.error && Array.isArray(response.data.error)) {
                    errorMessage =
                        response.data.error[0] || 'Invalid credentials';
                } else if (response.data.message) {
                    errorMessage = response.data.message;
                }

                Toast.show({
                    type: 'error',
                    text1: 'Login Failed',
                    text2: errorMessage,
                    position: 'top'
                });
            }
        } catch (error) {
            console.log('Login catch error:', error);
            let errorMessage = 'Invalid email/password or inactive account.';
            if (
                error.response?.data?.error &&
                Array.isArray(error.response.data.error)
            ) {
                errorMessage = error.response.data.error[0];
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: errorMessage,
                position: 'top'
            });
        } finally {
            setIsLoading(false);
        }
    };



    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleRegister = () => {
        navigation.navigate('Register');
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
                {isFirstTimeUse && (
                    <TouchableOpacity
                        onPress={handleGoBack}
                        className='flex-row items-center'
                    >
                        <Ionicons
                            name='chevron-back-outline'
                            size={28}
                            color='#3B82F6'
                            style={{ marginRight: 4 }}
                        />
                    </TouchableOpacity>
                )}
            </View>
            <View className='flex-1 justify-center px-8' style={{ zIndex: 1 }}>
                <View className='items-center mb-12'>
                    <Text className='text-3xl font-bold text-gray-900 text-center'>
                        Sign In to{'\n'}Create Exam
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
                        editable={!isLoading}
                    />
                </View>
                <View className='mb-2 relative'>
                    <TextInput
                        className='bg-white px-4 py-4 rounded-2xl text-gray-700 pr-12 shadow-sm'
                        placeholder='••••••••'
                        placeholderTextColor='#9CA3AF'
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!isPasswordShow}
                        editable={!isLoading}
                    />
                    <TouchableOpacity
                        className='absolute right-4 top-4'
                        onPress={() => setIsPasswordShow(!isPasswordShow)}
                        disabled={isLoading}
                    >
                        <Feather
                            name={isPasswordShow ? 'eye-off' : 'eye'}
                            size={18}
                            color='#9CA3AF'
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("ForgotPass")} className='self-end mb-8'>
                    <Text className='text-gray-500 text-sm'>
                        Recover Password ?
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleLogin}
                    className='bg-blue-600 py-4 rounded-2xl mb-8'
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color='white' />
                    ) : (
                        <Text className='text-white text-center text-lg font-medium'>
                            Sign In
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
                    className='flex-row justify-center mb-6'
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
                        onPress={signInWithGoogle}
                        disabled={isLoading}
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
                <View className='items-center pb-12 px-8' style={{ zIndex: 1 }}>
                    <Text className='text-gray-600 text-sm text-center'>
                        If you don&apos;t an account you can
                        <Text
                            onPress={handleRegister}
                            className='text-blue-600 font-bold'
                        >
                            Register here!
                        </Text>
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default LoginScreen;