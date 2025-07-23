import { Text, View } from 'react-native'
import React from 'react'
import { ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import bg1 from '../../assets/images/bg1.png';
import homepage1 from '../../assets/images/homepage1.png';
import homepage2 from '../../assets/images/homepage2.png';
import homepage3 from '../../assets/images/homepage3.png';


import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../apis/axiosClient';


const { width, height } = Dimensions.get('window');
const HomeScreen = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [examsData, setExamsData] = useState([]);
    const [totalExamInMonth, setTotalExamInMonth] = useState(0);
    const [loading, setLoading] = useState(true);

    // tính số lượng bài thi được tạo trong tháng hiện tại
    const calculateExamsThisMonth = (exams) => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); // 0-11
        const currentYear = currentDate.getFullYear();

        const total = exams.filter((exam) => {
            const createdDate = new Date(exam.createdAt);
            return (
                createdDate.getMonth() === currentMonth &&
                createdDate.getFullYear() === currentYear
            );
        }).length;
        setTotalExamInMonth(total);
    };


    // định dạng thời gian đã qua kể từ ngày tạo bài thi
    const formatTimeAgo = (isoDateString) => {
        const now = new Date();
        const date = new Date(isoDateString);
        const diffMs = now - date; // chênh lệch mili giây
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

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/account_users/me/exams');
            if (response.data.success) {
                setExamsData(response.data.data);
                calculateExamsThisMonth(response.data.data);
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

        }, [])
    );

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosClient.get('/api/account_users/me');
                if (response.data.success) {
                    setUser(response.data.data);
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Failed while get user data. Please try again later.',
                        position: 'top'
                    });
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Something went wrong. Please try again later.',
                    position: 'top'
                });

            }
        };

        loadData();
        fetchUser();
    }, []);

    console.log(user)
    return (
        <>
            <ScrollView className="flex-1 bg-gray-100 relative"  >

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

                <LinearGradient
                    colors={[
                        'rgba(88, 193, 202, 0.53)',
                        'rgba(67, 113, 222, 0.77)',
                        'rgba(115, 48, 222, 0.60)',
                    ]}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        paddingTop: 60,
                        paddingBottom: 60,
                        paddingRight: 20,
                        paddingLeft: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <View >
                        <Text className="text-2xl font-bold text-white">Hi, {user?.username}</Text>
                        <Text className="text-lg font-light text-white">Let&apos;s start create exam</Text>
                    </View>
                    <Image
                        source={user?.avatarUrl ? { uri: user.avatarUrl } : undefined}
                        className="w-24 h-24 rounded-full border-2 border-white "
                    />
                </LinearGradient>


                <View className="bg-white absolute top-40 left-1/2 -translate-x-1/2 w-96 rounded-2xl shadow p-4 mt-6">
                    <View className='flex-row justify-between items-center mb-2'>
                        <Text className="text-gray-500 text-sm">Exams created in month</Text>
                        <View className="flex-row justify-between items-center">

                            <TouchableOpacity onPress={() => navigation.navigate('MyExams')}>
                                <Text className="text-indigo-500 font-semibold">My exams</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text className="text-2xl font-bold text-gray-800">
                        {loading ? <ActivityIndicator size="small" className='p-1' color="#6366F1" /> : `${totalExamInMonth} exams`}
                    </Text>

                    <View className="bg-indigo-200 h-2 w-full rounded-full mt-2">
                        <View
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{
                                width: `${examsData?.length > 0
                                    ? (totalExamInMonth / examsData?.length) * 100
                                    : 0}%`
                            }}
                        />
                    </View>

                </View>


                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mt-20 px-4"
                    contentContainerStyle={{ paddingRight: 16 }}
                >
                    <View className="bg-[#CEECFE] rounded-xl w-72 p-4 mr-4 flex-row items-center justify-between">
                        <View className="flex-1 pr-2">
                            <Text className="text-base font-bold text-black mb-2">
                                Which exam would you like to create today?
                            </Text>
                            <TouchableOpacity className="bg-indigo-500 px-3 py-2 rounded-full self-start" onPress={() => {

                                navigation.navigate('Generate');
                            }}>
                                <Text className="text-white text-sm font-semibold">Get Started</Text>
                            </TouchableOpacity>
                        </View>

                        <Image source={homepage1} className="w-28 h-28" resizeMode="cover" />
                    </View>

                    <View className="bg-[#CEECFE] rounded-xl w-72 p-4 mr-4 flex-row items-center justify-between">
                        <Image source={homepage2} className="w-28 h-28" resizeMode="contain" />
                        <View className="flex-1 pl-4">
                            <Text className="text-base font-bold text-black mb-2">
                                Discover new exams to take today!
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Explore")} className="bg-indigo-500 px-3 py-2 rounded-full self-start">
                                <Text className="text-white text-sm font-semibold">Explore Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>



                <View className="mt-6 px-6">
                    <Text className="text-lg font-semibold mb-2 text-black">Recent Exams</Text>

                    {loading ? (
                        <ActivityIndicator size="large" color="#6366F1" className="mt-4 p-10" />
                    ) : examsData?.length === 0 ? (
                        <View className="bg-white rounded-xl px-4 py-6 mb-2 flex-row justify-between items-center">
                            <Text className="text-base font-medium  text-black">You haven't created any exams yet</Text>

                        </View>
                    ) :
                        examsData.slice(0, 3).map((exam) => (
                            <View key={exam.id} className="bg-white rounded-xl p-4 mb-2 flex-row justify-between items-center">
                                <View>
                                    <Text className="text-base font-semibold  text-black">{exam.examType}</Text>
                                    <Text className="text-sm text-gray-500">{exam.subjectName}</Text>
                                </View>
                                <View className="pl-4">
                                    <Text className="text-sm text-indigo-500 text-center font-semibold">{exam.questionCount} questions</Text>
                                    <Text className="text-sm text-gray-500">
                                        Created {formatTimeAgo(exam.createdAt)}
                                    </Text>

                                </View>
                            </View>
                        ))
                    }





                </View>



                <View className='px-6 mb-20'>
                    <View className="bg-purple-100 rounded-2xl mt-6 p-4 flex-row items-center">
                        <View className="flex-1 pr-2">
                            <Text className="text-lg font-bold text-purple-800 mb-1">Feedback</Text>
                            <Text className="text-sm text-purple-700">
                                We&apos;d love to hear your thoughts — please share your feedback with us!
                            </Text>
                        </View>

                        <Image
                            source={homepage3}
                            className="w-28 h-28"
                            resizeMode="contain"
                        />
                    </View>
                </View>



            </ScrollView>
        </>
    )
}

export default HomeScreen
