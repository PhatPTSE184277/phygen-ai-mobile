import React from 'react';
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
import ev from '../../assets/images/examreview.png';

const { width, height } = Dimensions.get('window');

const SummaryScreen = () => {
    const navigation = useNavigation();

    // Mock data từ GenerateScreen
    const examData = {
        title: 'Dao dong co hoc',
        grade: '11',
        chapters: [
            'Lorem',
            'Dao dong co hoc',
            'Song',
            'Quang',
            'Tan so'
        ],
        questions: 11,
        level: 'Difficult',
        format: 'Multiple Choice',
        matrix: '15 minutes'
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleViewExam = () => {
        console.log('View Exam');
    };

    const handleGenerateAnswer = () => {
        console.log('Generate Answer');
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
                    className='flex-row items-center p-3'
                >
                    <Ionicons
                        name='chevron-back-outline'
                        size={28}
                        color='#3B82F6'
                        style={{ marginRight: 4 }}
                    />
                </TouchableOpacity>
                <Text className='text-2xl font-bold text-gray-900'>
                    Summary
                </Text>
            </View>
            <View className='flex-1 px-6' style={{ zIndex: 1 }}>
                <View
                    className='bg-white rounded-3xl flex-1 mb-6'
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 12,
                        elevation: 8,
                        maxHeight: height * 0.5
                    }}
                >
                    <ScrollView
                        className='p-6'
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        <View className='flex-row mb-6'>
                            <View className='w-28 h-28 rounded-2xl mr-4 overflow-hidden'>
                                <Image
                                    source={ev}
                                    style={{
                                        width: '100%',
                                        height: '100%'
                                    }}
                                    resizeMode='cover'
                                />
                            </View>

                            <View className='flex-1 justify-center'>
                                <Text className='text-lg font-bold text-gray-900 mb-2'>
                                    {examData.title}
                                </Text>
                                <TouchableOpacity onPress={handleViewExam}>
                                    <Text className='text-blue-600 font-medium'>
                                        View Exam
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ gap: 16 }}>
                            <View className='flex-row justify-between items-center'>
                                <Text className='text-gray-700 font-medium'>
                                    Grade:
                                </Text>
                                <Text className='text-gray-400 font-normal'>
                                    {examData.grade}
                                </Text>
                            </View>

                            {/* Chapter */}
                            <View className='flex-row justify-between items-start'>
                                <Text className='text-gray-700 font-medium'>
                                    Chapter:
                                </Text>
                                <View className='flex-1 ml-4'>
                                    {examData.chapters.map((chapter, index) => (
                                        <Text
                                            key={index}
                                            className='text-gray-400 text-right text-sm'
                                            style={{
                                                lineHeight: 16,
                                                marginBottom: 2
                                            }}
                                        >
                                            {chapter}
                                        </Text>
                                    ))}
                                </View>
                            </View>

                            <View className='flex-row justify-between items-center'>
                                <Text className='text-gray-700 font-medium'>
                                    Question:
                                </Text>
                                <Text className='text-gray-400 font-normal'>
                                    {examData.questions}
                                </Text>
                            </View>

                            <View className='flex-row justify-between items-center'>
                                <Text className='text-gray-700 font-medium'>
                                    Level:
                                </Text>
                                <Text className='text-gray-400 font-normal'>
                                    {examData.level}
                                </Text>
                            </View>

                            <View className='flex-row justify-between items-center'>
                                <Text className='text-gray-700 font-medium'>
                                    Format:
                                </Text>
                                <Text className='text-gray-400 font-normal'>
                                    {examData.format}
                                </Text>
                            </View>

                            <View className='flex-row justify-between items-center'>
                                <Text className='text-gray-700 font-medium'>
                                    Matrix:
                                </Text>
                                <Text className='text-gray-400 font-normal'>
                                    {examData.matrix}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                

                <View className='pb-8'>
                    <TouchableOpacity
                        onPress={handleGenerateAnswer}
                        className='bg-blue-600 py-4 rounded-2xl flex-row items-center justify-center'
                    >
                        <Text className='text-white text-center text-lg font-medium mr-2'>
                            GENERATE ANSWER
                        </Text>
                        <Ionicons
                            name='chevron-forward-outline'
                            size={20}
                            color='white'
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default SummaryScreen;
