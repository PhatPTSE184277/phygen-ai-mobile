import { StyleSheet, Text, View } from 'react-native';
import React, { use, useCallback } from 'react';
import { useState, useEffect } from 'react';
import {
    ScrollView,
    Image,
    Dimensions,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import bg1 from '../../assets/images/bg1.png';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuthLogic } from '../utils/authLogic';
const { width, height } = Dimensions.get('window');

import axiosClient from '../apis/axiosClient';
import Toast from 'react-native-toast-message';

const AccountScreen = () => {
    const navigation = useNavigation();
    const { handleLogout } = useAuthLogic();
    const [user, setUser] = useState(null);
    const handleMenuPress = (label) => {
        switch (label) {
            case 'Dashboard':
                navigation.navigate('Dashboard');
                break;
            case 'My Profile':
                navigation.navigate('Profile');
                break;
            case 'Generate':
                navigation.navigate('Generate');
                break;
            case 'History':
                navigation.navigate('History');
                break;
            default:
                break;
        }
    };

    const fetchUser = async () => {
        try {
            const response = await axiosClient.get('/api/account_users/me');
            if (response.data.success) {
                setUser(response.data.data);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed while get user data. Please try again later.',
                    position: 'top'
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong. Please try again later.',
                position: 'top'
            });

        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchUser();

        }, [])
    );


    return (
        <>
            <SafeAreaView className='flex-1 bg-gray-100 relative'>
                <Image
                    source={bg1}
                    style={{
                        width: width,
                        height: height * 0.8,
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 0
                    }}
                    resizeMode='cover'
                />

                <ScrollView className='flex-1 p-6 pt-10'>
                    <Text className='text-2xl font-bold mb-6 text-black'>My Account</Text>
                    {/* Avatar + Gradient */}
                    <View className='items-center mb-14'>
                        <LinearGradient
                            colors={[
                                'rgba(88, 193, 202, 0.53)',
                                'rgba(67, 113, 222, 0.77)',
                                'rgba(115, 48, 222, 0.60)'
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                width: '100%',
                                height: 112,
                                borderRadius: 16
                            }}
                        />

                        <View className='absolute top-16'>
                            <View className='w-24 h-24 rounded-full bg-white justify-center items-center shadow-md relative'>
                                <Image
                                    source={user?.avatarUrl ? { uri: user.avatarUrl } : undefined}
                                    className='w-20 h-20 rounded-full'
                                    resizeMode='cover'
                                />

                            </View>
                        </View>
                    </View>

                    <View className='px-4'>

                        {['Dashboard', 'My Profile', 'Generate', 'History'].map(
                            (label, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className='flex-row justify-between items-center py-4'
                                    activeOpacity={0.7}
                                    onPress={() => handleMenuPress(label)}
                                >
                                    <Text className='text-lg font-medium text-black'>
                                        {label}
                                    </Text>
                                    <Ionicons
                                        name='chevron-forward'
                                        size={20}
                                        color='#858597'
                                    />
                                </TouchableOpacity>
                            )
                        )}
                        {/* Chat menu item */}
                        <TouchableOpacity
                            className='flex-row justify-between items-center py-4'
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('Chat')}
                        >
                            <Text className='text-lg font-medium text-black'>Chat</Text>
                            <Ionicons name='chevron-forward' size={20} color='#858597' />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className='flex-row justify-between items-center py-4 border-t border-gray-200 mt-2'
                            activeOpacity={0.7}
                            onPress={handleLogout}
                        >
                            <Text className='text-lg font-medium text-red-600'>
                                Logout
                            </Text>
                            <Ionicons
                                name='log-out-outline'
                                size={20}
                                color='#dc2626'
                            />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default AccountScreen;
