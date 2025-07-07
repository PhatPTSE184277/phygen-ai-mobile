import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Image,
    ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import bg1 from '../../assets/images/bg1.png';
import pre from '../../assets/images/premium.png';

const { width, height } = Dimensions.get('window');

const PremiumScreen = () => {
    const navigation = useNavigation();
    const [selectedPlan, setSelectedPlan] = useState('year');

    const plans = [
        {
            id: 'year',
            title: 'Premium 1 Year',
            description: 'Unlimited access to all features for 12 months',
            price: '599,000₫',
            colors: ['#8B5CF6', '#06B6D4']
        }
    ];

    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
    };

    const handleContinue = () => {
        navigation.navigate('VNPayPayment');
    };

    const handleBack = () => {
        navigation.goBack();
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
                    onPress={handleBack}
                    className='flex-row items-center'
                >
                    <Ionicons
                        name='chevron-back-outline'
                        size={28}
                        color='#3B82F6'
                        style={{ marginRight: 4 }}
                    />
                </TouchableOpacity>
                <Text className='text-2xl font-bold text-gray-900'>
                    Premium
                </Text>
            </View>
            <ScrollView className='flex-1 px-8' style={{ zIndex: 1 }}>
                <View className='items-center mb-8'>
                    <Text className='text-base text-gray-700 text-center leading-6 font-semibold'>
                        Unlock the best experience{"\n"}just for you!
                    </Text>
                </View>

                <View className='items-center mb-12'>
                    <Image
                        source={pre}
                        style={{
                            width: 220,
                            height: 130,
                            borderRadius: 24,
                            shadowColor: '#8B5CF6',
                            shadowOpacity: 0.15,
                            shadowRadius: 16,
                            shadowOffset: { width: 0, height: 8 },
                            elevation: 8
                        }}
                        resizeMode='contain'
                    />
                </View>

                <View className='mb-8 items-center'>
                    <View
                        style={{
                            borderRadius: 24,
                            borderWidth: 1.5,
                            borderColor: '#e0e7ff',
                            backgroundColor: '#fff',
                            width: 320,
                            alignSelf: 'center',
                            paddingVertical: 32,
                            paddingHorizontal: 20,
                            alignItems: 'center',
                            shadowColor: '#8B5CF6',
                            shadowOpacity: 0.06,
                            shadowRadius: 8,
                            shadowOffset: { width: 0, height: 4 },
                            elevation: 2,
                        }}
                    >
                        <MaterialCommunityIcons name="crown" size={32} color="#FFD700" style={{ marginBottom: 12, opacity: 0.9 }} />
                        <Text className='text-2xl font-extrabold mb-2 text-gray-900 text-center'>
                            {plans[0].title}
                        </Text>
                        <Text className='text-base text-gray-700 text-center mb-5' style={{ maxWidth: 260 }}>
                            {plans[0].description}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
                            <Text className='text-2xl font-extrabold text-[#6366F1] mr-2'>
                                {plans[0].price}
                            </Text>
                            <View style={{ backgroundColor: '#f3f4f6', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 3, marginLeft: 4 }}>
                                <Text className='text-xs font-semibold text-[#6366F1]'>Best Value</Text>
                            </View>
                        </View>
                    </View>
                </View>


                <TouchableOpacity
                    onPress={handleContinue}
                    className='bg-blue-600 py-4 rounded-2xl mb-8 flex-row items-center justify-center'

                >

                    <Text className='text-white text-center text-lg font-medium'>
                        CONTINUE
                    </Text>
                    <Ionicons
                        name='chevron-forward-outline'
                        size={22}
                        color='white'
                    />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default PremiumScreen;
