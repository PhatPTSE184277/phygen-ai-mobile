import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StatusBar,
    Image,
    Animated,
    Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import bg1 from '../../assets/images/bg1.png';
import logo from '../../assets/images/logo.png';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true
            })
        ]).start();

        const timer = setTimeout(() => {
            navigation.navigate('Welcome');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

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

            <View className='flex-1 justify-center items-center px-8 z-10'>
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }}
                    className='items-center'
                >
                    <Image
                        source={logo}
                        style={{
                            width: 500,
                            height: 200,
                            marginBottom: 16
                        }}
                        resizeMode='contain'
                    />
                    <Text className='text-lg text-gray-600 text-center'>
                        Smart Learning Platform
                    </Text>
                </Animated.View>
            </View>

            <View className='items-center pb-16' style={{ zIndex: 1 }}>
                <View className='flex-row mb-8 space-x-2'>
                    <View className='w-2 h-2 bg-gray-400 rounded-full opacity-50' />
                    <View className='w-2 h-2 bg-gray-400 rounded-full opacity-75' />
                    <View className='w-2 h-2 bg-gray-400 rounded-full' />
                </View>
            </View>
        </View>
    );
};

export default SplashScreen;
