import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image,
    Animated
} from 'react-native';

import bg1 from '../../assets/images/bg1.png';
import logo from '../../assets/images/logo.png';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    const scrollViewRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [buttonText, setButtonText] = useState('Next');
    const buttonOpacity = useRef(new Animated.Value(1)).current;

    const welcomeData = [
        {
            id: 1,
            subtitle: 'Smart Learning Platform',
            description:
                'Enhance your learning experience with our comprehensive exam preparation tools and interactive features',
            image: require('../../assets/images/welcome1.png')
        },
        {
            id: 2,
            subtitle: 'Interactive Exams',
            description:
                'Take interactive exams and track your progress with detailed analytics and personalized feedback',
            image: require('../../assets/images/welcome2.png')
        }
    ];
    useEffect(() => {
        const newText =
            currentIndex === welcomeData.length - 1 ? 'Get Started' : 'Next';

        if (newText !== buttonText) {
            Animated.timing(buttonOpacity, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true
            }).start(() => {
                setButtonText(newText);
                Animated.timing(buttonOpacity, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true
                }).start();
            });
        }
    }, [currentIndex]);

    const scrollToIndex = (index) => {
        scrollViewRef.current?.scrollTo({
            x: index * width,
            animated: true
        });
    };

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        if (index !== currentIndex) {
            setCurrentIndex(index);
        }
    };

    const handleNext = () => {
        if (currentIndex < welcomeData.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            scrollToIndex(nextIndex);
        } else {
            console.log('Get Started pressed');
            navigation.navigate('Login');
        }
    };

    const handleSkip = () => {
        console.log('Skip pressed');
    };

    const handleDotPress = (index) => {
        setCurrentIndex(index);
        scrollToIndex(index);
    };

    return (
        <View className='flex-1 bg-gray-100 relative'>
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

            <View className='items-center pt-16 pb-4' style={{ zIndex: 1 }}>
                <Image
                    source={logo}
                    style={{
                        width: 250,
                        height: 100
                    }}
                    resizeMode='contain'
                />
            </View>

            <View className='flex-1' style={{ zIndex: 1 }}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    bounces={false}
                    decelerationRate='fast'
                >
                    {welcomeData.map((item, index) => (
                        <View
                            key={item.id}
                            className='justify-center items-center px-8'
                            style={{ width }}
                        >
                            <View className='w-80 h-80 justify-center items-center mb-8'>
                                <Image
                                    source={item.image}
                                    className='w-full h-full'
                                    resizeMode='contain'
                                />
                            </View>

                            <Text className='text-xl font-bold text-blue-600 mb-4 text-center'>
                                {item.subtitle}
                            </Text>

                            <Text className='text-base text-gray-600 text-center leading-6 px-4'>
                                {item.description}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View className='items-center pb-12 px-8' style={{ zIndex: 1 }}>
                {/* Dots Indicator */}
                <View className='flex-row justify-center mb-8'>
                    {welcomeData.map((_, dotIndex) => (
                        <TouchableOpacity
                            key={dotIndex}
                            onPress={() => handleDotPress(dotIndex)}
                            className={`w-2 h-2 rounded-full mx-1 ${
                                dotIndex === currentIndex
                                    ? 'bg-blue-600'
                                    : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </View>

                <View className='flex-row justify-between items-center w-full'>
                    <TouchableOpacity onPress={handleSkip}>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleNext}
                        className='bg-blue-600 px-8 py-3 rounded-full'
                        style={{ minWidth: 120 }}
                    >
                        <Animated.View style={{ opacity: buttonOpacity }}>
                            <Text className='text-white text-base font-medium text-center'>
                                {buttonText}
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default WelcomeScreen;
