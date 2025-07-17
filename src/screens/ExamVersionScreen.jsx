import React, { useEffect, useState } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, Dimensions, StatusBar, Image, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import bg1 from '../../assets/images/bg1.png';
import axiosClient2 from '../apis/axiosClient2';

const { width, height } = Dimensions.get('window');

const ExamVersionScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { examId } = route.params;
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVersions = async () => {
            setLoading(true);
            console.log(examId)
            try {
                const res = await axiosClient2.get(
                    `/api/exam-versions/by-exam/${examId}?page=0&size=10&sortBy=id&sortDir=desc`
                );
                if (res.data && res.data.data) {
                    setVersions(res.data?.data?.content || []);
                }
            } catch (e) {
                console.log(e)
                setVersions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchVersions();
    }, [examId]);

    return (
        <View className='flex-1 bg-gray-100 relative'>
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
            <View className='flex-row items-center mt-6 px-4 pt-12 pb-8' style={{ zIndex: 1 }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
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
                    Exam Versions
                </Text>
            </View>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#6366F1" />
                    <Text style={{ marginTop: 10, fontSize: 16, color: '#6366F1' }}>Loading...</Text>
                </View>
            ) : (
                <View className='flex-1 px-6' style={{ zIndex: 1 }}>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View
                            className='bg-white rounded-3xl mb-6'
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 12,
                                elevation: 8,
                                padding: 16,
                                alignSelf: 'flex-start',
                                width: '100%'
                            }}
                        >
                            <Text className='text-lg font-bold text-gray-900 mb-4'>
                                Danh sách mã đề
                            </Text>
                            <View style={{ gap: 16, width: '100%' }}>
                                {versions.map((ver, idx) => (
                                    <TouchableOpacity
                                        key={ver.id}
                                        className='bg-gray-100 rounded-2xl px-4 py-4 flex-row justify-between items-center mb-2'
                                        activeOpacity={0.8}
                                        onPress={() => navigation.navigate('ExamDetail', { exam: { ...ver, examCode: ver.versionCode, pdfUrl: ver.pdfUrl } })}
                                        style={{
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.08,
                                            shadowRadius: 2
                                        }}
                                    >
                                        <View>
                                            <Text className='text-base font-bold text-gray-900 mb-1'>
                                                {ver.versionCode || 'Unknown Version'}
                                            </Text>
                                            <Text className='text-sm text-gray-500'>
                                                Tap to view detail
                                            </Text>
                                        </View>
                                        <Ionicons
                                            name='chevron-forward-outline'
                                            size={22}
                                            color='#3B82F6'
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

export default ExamVersionScreen;