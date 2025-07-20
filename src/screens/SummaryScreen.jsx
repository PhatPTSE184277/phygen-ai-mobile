import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Image,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import bg1 from '../../assets/images/bg1.png';
import ev from '../../assets/images/examreview.png';
import MatrixLabels from '../constants/MatrixLabels';
import axiosClient2 from '../apis/axiosClient2';

const { width, height } = Dimensions.get('window');

const SummaryScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const examData = route.params?.examPreview || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    console.log(examData)

    const handleBack = () => {
        navigation.goBack();
    };

    const handleGenerate = async () => {
        setError('');
        setLoading(true);
        try {
            const payload = {
                subjectId: examData.subjectId,
                examType: examData.examType,
                difficultyLevel: examData.difficultyLevel,
                examQuantity: examData.examQuantity
            };
            const res = await axiosClient2.post('/api/exams', payload);
            if (res.data && res.data.success) {
                navigation.navigate('Overview', { examResult: res.data });
            }
        } catch (err) {
            console.log('Error generate exam:', err);
        } finally {
            setLoading(false);
        }
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
                                    {examData.title || 'No Title'}
                                </Text>
                            </View>
                        </View>
                        <View style={{ gap: 16 }}>
                            <View className='flex-row justify-between items-center'>
                                <Text className='text-gray-700 font-medium'>
                                    Subject:
                                </Text>
                                <Text className='text-gray-400 font-normal'>
                                    {examData.subjectName || '-'}
                                </Text>
                            </View>
                            <View className='flex-row justify-between items-center'>
                                <Text className='text-gray-700 font-medium'>
                                    Matrix:
                                </Text>
                                <Text className='text-gray-400 font-normal'>
                                    {MatrixLabels[examData.examType] || examData.examType || '-'}
                                </Text>
                            </View>
                            <View className='flex-row justify-between items-center'>
                                <Text className='text-gray-700 font-medium'>
                                    Level:
                                </Text>
                                <Text className='text-gray-400 font-normal'>
                                    {examData.difficultyLevel || '-'}
                                </Text>
                            </View>
                            <View className='flex-row justify-between items-center'>
                                <Text className='text-gray-700 font-medium'>
                                    Variants:
                                </Text>
                                <Text className='text-gray-400 font-normal'>
                                    {examData.examQuantity || '-'}
                                </Text>
                            </View>
                        </View>
                        {error ? (
                            <Text style={{ color: 'red', marginTop: 16, textAlign: 'center' }}>
                                {error}
                            </Text>
                        ) : null}
                    </ScrollView>
                </View>
                <View className='pb-8'>
                    <TouchableOpacity
                        onPress={handleGenerate}
                        className='bg-blue-600 py-4 rounded-2xl flex-row items-center justify-center'
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text className='text-white text-center text-lg font-medium mr-2'>
                                    GENERATE
                                </Text>
                                <Ionicons
                                    name='chevron-forward-outline'
                                    size={20}
                                    color='white'
                                />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default SummaryScreen;