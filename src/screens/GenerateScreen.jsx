import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Image,
    ScrollView,
    TextInput,
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
    const [title, setTitle] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('easy');
    const [selectedMatrix, setSelectedMatrix] = useState('15-minute test');
    const [selectedVariants, setSelectedVariants] = useState(1);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [matrices, setMatrices] = useState([]);
    const [levels, setLevels] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const variantValues = [1, 2, 3, 4];

    useEffect(() => {
        const fetchSubjects = async () => {
            setIsLoading(true);
            try {
                const response = await axiosClient.get('/api/subjects/active');
                if (response.data.success) {
                    const sortedSubjects = response.data.data.sort((a, b) => a.id - b.id);
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

        const fetchLevels = async () => {
            setIsLoading(true);
            try {
                const response = await axiosClient2.get('/api/matrix-details/enum-difficult-level');
                if (response.data.success) {
                    setLevels(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching levels:', error);
            }
        };

        fetchSubjects();
        fetchLevels();
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
            }finally{
                setIsLoading(false);
            }
        };

        fetchMatrices();
    }, [selectedSubject]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleConfirm = async () => {
        if (!title || !selectedSubject || !selectedMatrix || !selectedLevel || !selectedVariants) {
            setError('Please fill in all required fields!');
            return;
        }
        setError('');
        const payload = {
            title,
            subjectId: selectedSubject?.id,
            subjectName: selectedSubject?.name,
            examType: selectedMatrix,
            difficultyLevel: selectedLevel,
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
                <ScrollView className='flex-1 px-6' style={{ zIndex: 1 }}>
                    <View className='mb-6'>
                        <Text className='text-base font-medium text-gray-900 mb-3'>
                            Title
                        </Text>
                        <TextInput
                            value={title}
                            onChangeText={text => {
                                setTitle(text);
                                if (error) setError('');
                            }}
                            placeholder='Enter Exam Title'
                            className='bg-white rounded-xl px-4 py-4 text-base text-gray-900'
                            style={{
                                borderColor: error ? 'red' : '#fff',
                                borderWidth: error ? 1.5 : 0,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.1,
                                shadowRadius: 2
                            }}
                        />
                        {error ? (
                            <Text style={{ color: 'red', marginTop: 6, marginLeft: 4, fontSize: 14 }}>
                                {error}
                            </Text>
                        ) : null}
                    </View>

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
                            Level
                        </Text>
                        <View className='flex-row' style={{ gap: 12 }}>
                            {levels.map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    onPress={() => setSelectedLevel(level)}
                                    className={`px-6 py-3 rounded-xl ${selectedLevel === level ? 'bg-blue-600' : 'bg-white'}`}
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 2
                                    }}
                                >
                                    <Text
                                        className={`text-base font-medium ${selectedLevel === level ? 'text-white' : 'text-gray-700'}`}
                                    >
                                        {level}
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

                    <TouchableOpacity
                        onPress={handleConfirm}
                        className='bg-blue-600 py-4 rounded-2xl mb-12 flex-row items-center justify-center'
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
                </ScrollView>
            )}
        </View>
    );
};

export default GenerateScreen;
