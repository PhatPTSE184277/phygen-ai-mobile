import { Text, View, ScrollView, Image, Dimensions, TextInput, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import bg1 from '../../assets/images/bg1.png';
import explore1 from '../../assets/images/explore1.png';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import axiosClient2 from '../apis/axiosClient2'; // dùng axiosClient2 cho API mới
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const HistoryScreen = () => {
    const navigation = useNavigation();
    const handleBack = () => navigation.goBack();

    const [loading, setLoading] = useState(false);
    const [examsData, setExamsData] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);

    // Định dạng thời gian đã qua
    const formatTimeAgo = (isoDateString) => {
        if (!isoDateString) return '-';
        const now = new Date();
        const date = new Date(isoDateString);
        const diffMs = now - date;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
        if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 30) return `${diffDays} days ago`;
        if (diffMonths < 12) return `${diffMonths} months ago`;
        return `${diffYears} years ago`;
    };

    // Load dữ liệu từ API mới
    const loadData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient2.get(
                `/api/exam/getAllExamFromCurrentAccount?page=${page}&size=${size}&sortBy=id&sortDir=desc`
            );
            if (response.data && response.data.data && Array.isArray(response.data.data.content)) {
                setExamsData(response.data.data.content);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to get exams data. Try again later.',
                    position: 'top',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong. Try again later.',
                position: 'top',
            });
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [page])
    );

    return (
        <View className="flex-1 bg-gray-100 relative">
            <StatusBar backgroundColor='#F3F4F6' barStyle='dark-content' />
            <View className='absolute bottom-0 left-0 right-0' style={{ zIndex: 0 }}>
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
            <View className='flex-row items-center mt-6 px-4 pt-12 bg-transparent' style={{ zIndex: 1 }}>
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
                    History
                </Text>
            </View>
            <View className='px-8 flex-1'>
                <View className='mt-4'>
                    <View className="flex-row items-center bg-white rounded-2xl px-4 py-1 ">
                        <Ionicons name="search" size={18} color="#B8B8D2" />
                        <TextInput
                            placeholder="Find Exams"
                            placeholderTextColor="#B8B8D2"
                            className="flex-1 p-3 text-black"
                        />
                        <Ionicons name="options-outline" size={20} color="#B8B8D2" />
                    </View>
                </View>
                {loading ? (
                    <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 32 }} />
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 60 }}
                        className='mt-6'
                    >
                        {examsData?.map((exam, index) => (
                            <View key={index} className='bg-white flex-row rounded-xl p-4 gap-6 items-center mb-4'>
                                <View className='bg-[#FFEBF0] p-4 px-6 rounded-xl'>
                                    <Image source={explore1} className="w-10 h-10" resizeMode="contain" />
                                </View>
                                <View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{exam.examType}</Text>
                                    <View className='flex-row items-center gap-2 mt-1'>
                                        <Ionicons
                                            name="time-outline"
                                            size={14}
                                            color={"#B8B8D2"}
                                        />
                                        <Text className='text-[#B8B8D2] font-light text-sm'>
                                            {formatTimeAgo(exam.createAt)}
                                        </Text>
                                    </View>
                                    <Text className='text-[#B8B8D2] font-light text-sm mt-1'>
                                        {exam.questionCount ? `${exam.questionCount} questions` : ''}
                                    </Text>
                                </View>
                            </View>
                        ))}
                        {examsData.length === 0 && (
                            <Text style={{ textAlign: 'center', color: '#B8B8D2', marginTop: 32 }}>
                                No exam history found.
                            </Text>
                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default HistoryScreen;