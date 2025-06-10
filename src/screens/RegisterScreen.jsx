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
import facebookIcon from '../../assets/images/fb.png';
import Feather from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const RegisterScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);

    const handleRegister = () => {
        console.log('Register pressed');
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
                className='flex-row items-center px-4 pt-12 pb-8'
                style={{ zIndex: 1 }}
            >
                <TouchableOpacity
                    onPress={handleGoBack}
                    className='flex-row items-center'
                >
                    <Text className='text-blue-500 text-base'>{`<< Go Back`}</Text>
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
                        placeholder='••••••••'
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
                        placeholder='••••••••'
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
                >
                    <Text className='text-white text-center text-lg font-medium'>
                        Register
                    </Text>
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
                            style={{ width: 22, height: 28 }}
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
                            style={{ width: 22, height: 28 }}
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