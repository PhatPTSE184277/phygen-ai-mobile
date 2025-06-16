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
import bg1 from '../../assets/images/bg1.png';
import pre from '../../assets/images/premium.png';

const { width, height } = Dimensions.get('window');

const PremiumScreen = () => {
    const navigation = useNavigation();
    const [selectedPlan, setSelectedPlan] = useState('month');

    const plans = [
        {
            id: 'week',
            title: 'Week',
            description: 'Full premium for 7 days',
            price: '$7',
            colors: ['#F8F9FA', '#F8F9FA']
        },
        {
            id: 'month',
            title: 'Month',
            description: 'Unlimited premium for 1 month',
            price: '$28',
            popular: true,
            colors: ['#E8E8FF', '#E8E8FF']
        },
        {
            id: 'year',
            title: 'Year',
            description: 'Save with Premium for 1 year',
            price: '$300',
            colors: ['#06B6D4', '#8B5CF6']
        }
    ];

    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
    };

    const handleContinue = () => {
        console.log('Selected plan:', selectedPlan);
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
            </View>

            <ScrollView className='flex-1 px-8' style={{ zIndex: 1 }}>
                <View className='items-center mb-8'>
                    <Text className='text-3xl font-bold text-gray-900 text-center mb-2'>
                        Premium
                    </Text>
                    <Text className='text-base text-gray-600 text-center leading-6'>
                        The best experience tailored{'\n'}just for you.
                    </Text>
                </View>

                <View className='items-center mb-12'>
                    <Image
                        source={pre}
                        style={{
                            width: 200,
                            height: 120
                        }}
                        resizeMode='contain'
                    />
                </View>

               <View className='mb-8' style={{ gap: 16 }}>
                    {plans.map((plan) => (
                        <View
                            key={plan.id}
                            className='rounded-2xl'
                            style={{
                                borderWidth: selectedPlan === plan.id ? 2 : 1,
                                borderColor: selectedPlan === plan.id ? '#6366F1' : 'rgba(0,0,0,0.1)',
                                borderRadius: 16,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => handlePlanSelect(plan.id)}
                                className='rounded-2xl overflow-hidden'
                            >
                                <LinearGradient
                                    colors={plan.colors}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{
                                        padding: 20,
                                        borderRadius: 14,
                                        minHeight: 72
                                    }}
                                >
                                    <View className='flex-row items-center justify-between'>
                                        <View className='flex-row items-center flex-1'>
                                            <View
                                                className={`w-6 h-6 rounded items-center justify-center mr-4 ${
                                                    selectedPlan === plan.id
                                                        ? 'bg-[#6366F1]'
                                                        : 'bg-white border border-gray-300'
                                                }`}
                                            >
                                                {selectedPlan === plan.id && (
                                                    <Ionicons
                                                        name='checkmark'
                                                        size={16}
                                                        color='white'
                                                    />
                                                )}
                                            </View>

                                            <View className='flex-1'>
                                                <Text className='text-xl font-semibold mb-1 text-gray-800'>
                                                    {plan.title}
                                                </Text>
                                                <Text className='text-sm text-gray-600'>
                                                    {plan.description}
                                                </Text>
                                            </View>
                                        </View>

                                        <Text className='text-xl font-bold text-gray-800'>
                                            {plan.price}
                                        </Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    onPress={handleContinue}
                    className='bg-blue-600 py-4 rounded-2xl mb-12 flex-row items-center justify-center'
                >
                    <Text className='text-white text-center text-lg font-medium mr-2'>
                        CONTINUE
                    </Text>
                    <Ionicons
                        name='chevron-forward-outline'
                        size={20}
                        color='white'
                    />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default PremiumScreen;
