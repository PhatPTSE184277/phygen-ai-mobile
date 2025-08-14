import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import bg1 from '../../assets/images/bg1.png';
import axiosClient from '../apis/axiosClient';
import axiosClient2 from '../apis/axiosClient2';
import { StepSelector } from '../components/index';
import MatrixLabels from '../constants/MatrixLabels';

const { width, height } = Dimensions.get('window');

const GenerateScreen = () => {
    const navigation = useNavigation();
    const [selectedMatrix, setSelectedMatrix] = useState('15-minute test');
    const [selectedVariants, setSelectedVariants] = useState(1);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [matrices, setMatrices] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const variantValues = [1, 2, 3, 4];

    useEffect(() => {
        const fetchSubjects = async () => {
            setIsLoading(true);
            try {
                const response = await axiosClient.get('/api/subjects?IsDeleted=false');
                if (response.data.success) {
                    const sortedSubjects = response.data.data.items.sort((a, b) => a.id - b.id);
                    setSubjects(sortedSubjects);

                    const defaultSubject = sortedSubjects[0];
                    if (defaultSubject) {
                        setSelectedSubject(defaultSubject);
                    }
                } else {
                    console.error('Failed to fetch subjects:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, []);

    useEffect(() => {
        const fetchMatrices = async () => {
            if (!selectedSubject) return;
            try {
                const response = await axiosClient2.get(
                    `/api/exam-matrices/by-subject/${selectedSubject.id}`
                );
                if (response.data.success) {
                    setMatrices(response.data.data);
                    if (response.data.data.length > 0) {
                        setSelectedMatrix(response.data.data[0].examType);
                    }
                } else {
                    console.error('Failed to fetch matrices:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching matrices:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatrices();
    }, [selectedSubject]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleConfirm = async () => {
        if (!selectedSubject || !selectedMatrix || !selectedVariants) {
            setError('Please fill in all required fields!');
            return;
        }
        setError('');

        const selectedMatrixObject = matrices.find(m =>
            (m.examType || m.examtype) === selectedMatrix
        );

        const payload = {
            subjectId: selectedSubject?.id,
            subjectName: selectedSubject?.name,
            examType: selectedMatrix,
            matrixId: selectedMatrixObject?.id,
            examQuantity: String(selectedVariants)
        };
        try {
            navigation.navigate('Summary', { examPreview: payload });
        } catch (error) {
            console.error('Error during confirmation:', error);
        }
    };

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
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
                className='flex-row items-center mt-6 px-4 pt-12 bg-transparent'
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
                    Generate
                </Text>
            </View>

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#3B82F6" className="mt-4 p-10" />
                </View>
            ) : (
                <>
                    <ScrollView className='flex-1 px-6' style={{ zIndex: 1 }}>

                        {/* Subject */}
                        <View className='mb-6'>
                            <Text className='text-base font-medium text-gray-900 mb-3'>
                                Subjects
                            </Text>
                            <View className='flex-row flex-wrap' style={{ gap: 12 }}>
                                {subjects.map((subject) => (
                                    <TouchableOpacity
                                        key={subject.id}
                                        onPress={() => handleSubjectSelect(subject)}
                                        className={`px-4 py-3 rounded-xl ${selectedSubject?.id === subject.id ? 'bg-blue-600' : 'bg-white'}`}
                                        style={{
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2
                                        }}
                                    >
                                        <Text
                                            className={`text-sm font-medium ${selectedSubject?.id === subject.id ? 'text-white' : 'text-gray-700'}`}
                                        >
                                            {subject.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View className='mb-6'>
                            <Text className='text-base font-medium text-gray-900 mb-3'>
                                Matrix
                            </Text>
                            <View className='flex-row flex-wrap' style={{ gap: 12 }}>
                                {[...new Set(matrices.map(m => m.examType || m.examtype))].map((examType, idx) => (
                                    <TouchableOpacity
                                        key={examType + idx}
                                        onPress={() => setSelectedMatrix(examType)}
                                        className={`px-4 py-3 rounded-xl ${selectedMatrix === examType ? 'bg-blue-600' : 'bg-white'}`}
                                        style={{
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2
                                        }}
                                    >
                                        <Text
                                            className={`text-sm font-medium ${selectedMatrix === examType ? 'text-white' : 'text-gray-700'}`}
                                        >
                                            {MatrixLabels[examType] || examType}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View className='mb-8'>
                            <Text className='text-base font-medium text-gray-900 mb-3'>
                                Variants
                            </Text>
                            <StepSelector
                                values={variantValues}
                                selectedValue={selectedVariants}
                                onValueChange={setSelectedVariants}
                            />
                        </View>
                    </ScrollView>

                    <View
                        style={{
                            paddingHorizontal: 24,
                            paddingBottom: 32,
                            backgroundColor: 'transparent',
                        }}
                    >
                        <TouchableOpacity
                            onPress={handleConfirm}
                            className='bg-blue-600 py-4 rounded-2xl flex-row items-center justify-center'
                        >
                            <Text className='text-white text-center text-lg font-medium mr-2'>
                                CONFIRM
                            </Text>
                            <Ionicons
                                name='chevron-forward-outline'
                                size={20}
                                color='white'
                            />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

export default GenerateScreen;