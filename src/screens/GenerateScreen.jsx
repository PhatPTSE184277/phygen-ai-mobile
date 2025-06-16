import React, { useState } from 'react';
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

const { width, height } = Dimensions.get('window');

const GenerateScreen = () => {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('10');
    const [selectedChapters, setSelectedChapters] = useState([
        'Design',
        'Coding'
    ]);
    const [selectedQuestions, setSelectedQuestions] = useState(30);
    const [selectedLevel, setSelectedLevel] = useState('Easy');
    const [selectedFormat, setSelectedFormat] = useState('Multiple Choice');
    const [selectedMatrix, setSelectedMatrix] = useState('15-minute test');
    const [selectedVariants, setSelectedVariants] = useState(4);

    const grades = ['10', '11', '12'];
    const chapters = [
        'Design',
        'Painting',
        'Coding',
        'Music',
        'Visual identity',
        'Mathematics',
        'Music',
        'Visual identity',
        'Mathematics'
    ];
    const levels = ['Easy', 'Medium', 'Difficult'];
    const formats = ['Multiple Choice', 'Essay'];
    const matrices = [
        '15-minute test',
        'One-period test',
        'Mid-term exam',
        'One-period test'
    ];

    // Các mốc cố định
    const questionValues = [10, 30, 60];
    const variantValues = [1, 4, 8];

    const handleBack = () => {
        navigation.goBack();
    };

    const handleChapterSelect = (chapter) => {
        if (selectedChapters.includes(chapter)) {
            setSelectedChapters(selectedChapters.filter((c) => c !== chapter));
        } else {
            setSelectedChapters([...selectedChapters, chapter]);
        }
    };

    const handleGenerate = () => {
        console.log('Generating exam...');
        navigation.navigate('Summary');
    };

    return (
        <View className='flex-1 bg-gray-100 relative'>
            <StatusBar backgroundColor='#F3F4F6' barStyle='dark-content' />

            {/* Background Image */}
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

            {/* Header */}
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
            </View>

            <ScrollView className='flex-1 px-6' style={{ zIndex: 1 }}>
                <Text className='text-2xl font-bold text-gray-900 mb-6'>
                    Generate
                </Text>

                {/* Title Input */}
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

                {/* Grade */}
                <View className='mb-6'>
                    <Text className='text-base font-medium text-gray-900 mb-3'>
                        Grade
                    </Text>
                    <View className='flex-row' style={{ gap: 12 }}>
                        {grades.map((grade) => (
                            <TouchableOpacity
                                key={grade}
                                onPress={() => setSelectedGrade(grade)}
                                className={`px-6 py-3 rounded-xl ${selectedGrade === grade ? 'bg-blue-600' : 'bg-white'}`}
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2
                                }}
                            >
                                <Text
                                    className={`text-base font-medium ${selectedGrade === grade ? 'text-white' : 'text-gray-700'}`}
                                >
                                    {grade}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Chapter */}
                <View className='mb-6'>
                    <Text className='text-base font-medium text-gray-900 mb-3'>
                        Chapter
                    </Text>
                    <View className='flex-row flex-wrap' style={{ gap: 12 }}>
                        {chapters.map((chapter, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleChapterSelect(chapter)}
                                className={`px-4 py-3 rounded-xl ${selectedChapters.includes(chapter) ? 'bg-blue-600' : 'bg-white'}`}
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2
                                }}
                            >
                                <Text
                                    className={`text-sm font-medium ${selectedChapters.includes(chapter) ? 'text-white' : 'text-gray-700'}`}
                                >
                                    {chapter}
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

                {/* Level */}
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

                {/* Format */}
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

                {/* Matrix */}
                <View className='mb-6'>
                    <Text className='text-base font-medium text-gray-900 mb-3'>
                        Matrix
                    </Text>
                    <View className='flex-row flex-wrap' style={{ gap: 12 }}>
                        {matrices.map((matrix, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedMatrix(matrix)}
                                className={`px-4 py-3 rounded-xl ${selectedMatrix === matrix ? 'bg-blue-600' : 'bg-white'}`}
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2
                                }}
                            >
                                <Text
                                    className={`text-sm font-medium ${selectedMatrix === matrix ? 'text-white' : 'text-gray-700'}`}
                                >
                                    {matrix}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Variants */}
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
