
import { Text, View, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import bg1 from '../../assets/images/bg1.png';

const { width, height } = Dimensions.get('window');

import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import axiosClient from '../apis/axiosClient';
import Toast from 'react-native-toast-message';


const PremiumScreen = () => {
    const [user, setUser] = useState(null);
    const navigation = useNavigation();


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

    const handleClick = () => {
        navigation.navigate('VNPayPayment');
    };
    return (
        user?.accountType !== 'premium' ? (
            <View className="flex-1 bg-gray-100 relative">
                <Image
                    source={bg1}
                    style={{ width: width, height: height * 0.8, position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 0 }}
                    resizeMode="cover"
                />
                <ScrollView className="flex-1 px-6 pt-8" contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* Header with back button */}
                    <View className="flex-row items-center mb-8 mt-4">
                        <Text className="text-2xl font-bold text-black">Premium Membership</Text>
                    </View>
                    {/* Card */}
                    <View className="bg-white rounded-3xl p-8 shadow-lg items-center mb-8 border border-gray-100">
                        <Ionicons name="sparkles" size={56} color="#4461F2" className="mb-2" />
                        <Text className="text-xl font-bold text-gray-900 mb-2">Annual Plan</Text>
                        <Text className="text-5xl font-extrabold text-blue-600 mb-2">599,000₫</Text>
                        <Text className="text-base text-gray-500 mb-4">per year</Text>
                        <TouchableOpacity onPress={handleClick} className="bg-blue-600 rounded-xl py-3 px-10 mt-2 w-full shadow" activeOpacity={0.85} >
                            <Text className="text-center text-white font-bold text-lg tracking-wide">Upgrade Now</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Benefits */}
                    <View className="mb-8 px-2">
                        <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">Why go Premium?</Text>
                        <View className="space-y-4">
                            <View className="flex-row items-center">
                                <Ionicons name="checkmark-circle" size={22} color="#4461F2" className="mr-2" />
                                <Text className="text-base text-gray-700">Unlimited exam creation</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons name="checkmark-circle" size={22} color="#4461F2" className="mr-2" />
                                <Text className="text-base text-gray-700">Advanced statistics & analytics</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons name="checkmark-circle" size={22} color="#4461F2" className="mr-2" />
                                <Text className="text-base text-gray-700">Priority customer support</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons name="checkmark-circle" size={22} color="#4461F2" className="mr-2" />
                                <Text className="text-base text-gray-700">Access to exclusive features</Text>
                            </View>
                        </View>
                    </View>
                    {/* Description */}
                    <View className="bg-white rounded-2xl p-6 shadow border border-gray-100 mb-8">
                        <Text className="text-base text-gray-600 text-center leading-6">
                            Unlock all features and enjoy unlimited access to exam creation, advanced analytics, and priority support. Upgrade now for the best learning experience!
                        </Text>
                    </View>
                </ScrollView>
            </View>
        ) : (
            <View className="flex-1 bg-gray-100 justify-center items-center">
                <Image
                    source={bg1}
                    style={{ width: width, height: height * 0.8, position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 0 }}
                    resizeMode="cover"
                />
                <View className="bg-white rounded-3xl p-8 shadow-lg items-center border border-gray-100 mx-6">
                    <Ionicons name="sparkles" size={56} color="#4461F2" className="mb-2" />
                    <Text className="text-2xl font-bold text-blue-700 mb-2">You are Premium!</Text>
                    <Text className="text-base text-gray-700 mb-4 text-center">Thank you for supporting us. You have full access to all features and priority support.</Text>
                    <View className="flex-row items-center justify-center mb-2">
                        <Ionicons name="checkmark-circle" size={22} color="#4461F2" className="mr-2" />
                        <Text className="text-base text-gray-700">Premium Active</Text>
                    </View>
                </View>
            </View>
        )
    );
};

export default PremiumScreen;

