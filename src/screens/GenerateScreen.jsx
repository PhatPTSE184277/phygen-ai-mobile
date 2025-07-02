import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Image,
    ScrollView,
    TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import bg1 from '../../assets/images/bg1.png';
import { StepSelector } from '~/components';
import axiosClient from '~/apis/axiosClient';

const { width, height } = Dimensions.get('window');

const GenerateScreen = () => {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState(30);
    const [selectedLevel, setSelectedLevel] = useState('Easy');
    const [selectedFormat, setSelectedFormat] = useState('Multiple Choice');
    const [selectedMatrix, setSelectedMatrix] = useState('15-minute test');
    const [selectedVariants, setSelectedVariants] = useState(4);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [topics, setTopics] = useState([]);
    const [matrices, setMatrices] = useState([]);

    const levels = ['Easy', 'Medium', 'Difficult'];
    const formats = ['Multiple Choice', 'Essay'];
    const questionValues = [10, 30, 60];
    const variantValues = [1, 4, 8];

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axiosClient.get('/api/subjects/active');
                if (response.data.success) {
                    const sortedSubjects = response.data.data.sort((a, b) => a.id - b.id);
                    setSubjects(sortedSubjects);

                    const defaultSubject = sortedSubjects[0];
                    if (defaultSubject) {
                        setSelectedSubject(defaultSubject);
                        fetchTopics(defaultSubject.id);
                    }
                } else {
                    console.error('Failed to fetch subjects:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        const fetchMatrices = async () => {
            try {
                const response = await axiosClient.get('https://backend-phygen.onrender.com/api/exam_matrixs/active');
                if (response.data.success) {
                    setMatrices(response.data.data);
                } else {
                    console.error('Failed to fetch matrices:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching matrices:', error);
            }
        };

        fetchSubjects();
        fetchMatrices();
    }, []);

    const fetchTopics = async (subjectId) => {
        try {
            const response = await axiosClient.get(`/api/topics/${subjectId}`);
            if (response.data.success) {
                setTopics([response.data.data]);
            } else {
                console.error('Failed to fetch topics:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleGenerate = () => {
        console.log('Generating exam...');
        navigation.navigate('Summary');
    };

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
        fetchTopics(subject.id);
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
            <ScrollView className='flex-1 px-6' style={{ zIndex: 1 }}>
                <View className='mb-6'>
                    <Text className='text-base font-medium text-gray-900 mb-3'>
                        Title
                    </Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder='Enter Exam Title'
                        className='bg-white rounded-xl px-4 py-4 text-base text-gray-900'
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2
                        }}
                    />
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

                {/* Topics */}
                <View className='mb-6'>
                    <Text className='text-base font-medium text-gray-900 mb-3'>
                        Topics
                    </Text>
                    <View className='flex-row flex-wrap' style={{ gap: 12 }}>
                        {topics.map((topic) => (
                            <TouchableOpacity
                                key={topic.id}
                                onPress={() => console.log(`Selected topic: ${topic.name}`)}
                                className={`px-4 py-3 rounded-xl bg-white`}
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2,
                                }}
                            >
                                <Text className='text-sm font-medium text-gray-700'>
                                    {topic.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Questions */}
                <View className='mb-6'>
                    <Text className='text-base font-medium text-gray-900 mb-3'>
                        Questions
                    </Text>
                    <StepSelector
                        values={questionValues}
                        selectedValue={selectedQuestions}
                        onValueChange={setSelectedQuestions}
                    />
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
                        Format
                    </Text>
                    <View className='flex-row' style={{ gap: 12 }}>
                        {formats.map((format) => (
                            <TouchableOpacity
                                key={format}
                                onPress={() => setSelectedFormat(format)}
                                className={`px-6 py-3 rounded-xl ${selectedFormat === format ? 'bg-blue-600' : 'bg-white'}`}
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2
                                }}
                            >
                                <Text
                                    className={`text-base font-medium ${selectedFormat === format ? 'text-white' : 'text-gray-700'}`}
                                >
                                    {format}
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
                        {matrices.map((matrix) => (
                            <TouchableOpacity
                                key={matrix.id}
                                onPress={() => setSelectedMatrix(matrix.examtype)}
                                className={`px-4 py-3 rounded-xl ${selectedMatrix === matrix.examtype ? 'bg-blue-600' : 'bg-white'}`}
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2
                                }}
                            >
                                <Text
                                    className={`text-sm font-medium ${selectedMatrix === matrix.examtype ? 'text-white' : 'text-gray-700'}`}
                                >
                                    {matrix.examtype}
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
                    onPress={handleGenerate}
                    className='bg-blue-600 py-4 rounded-2xl mb-12 flex-row items-center justify-center'
                >
                    <Text className='text-white text-center text-lg font-medium mr-2'>
                        GENERATE
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

export default GenerateScreen;
