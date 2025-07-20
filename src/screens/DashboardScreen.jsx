import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    StatusBar,
    ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axiosClient from '../apis/axiosClient';
import Toast from 'react-native-toast-message';

import bg1 from '../../assets/images/bg1.png';

const { width, height } = Dimensions.get('window');

const DashboardScreen = () => {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [allExams, setAllExams] = useState([]);
    const [yearExists, setYearExists] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const handleBack = () => {
        navigation.goBack();
    };

    // Thống kê số bài kiểm tra theo tháng
    const getMonthStats = (exams) => {
        const monthMap = Array(12).fill(0);
        exams.forEach((item) => {
            const date = new Date(item.createdAt);
            if (date.getFullYear() === selectedYear) {
                monthMap[date.getMonth()] += 1;
            }
        });
        return monthMap;
    }

    const getSubjectStats = (exams) => {
        const subjectMap = {};
        exams.forEach((item) => {
            const date = new Date(item.createdAt);
            if (date.getFullYear() === selectedYear) {
                subjectMap[item.subjectName] = (subjectMap[item.subjectName] || 0) + (item.questionCount || 0);
            }
        });
        return subjectMap;
    };

    const getExamTypeStats = (exams) => {
        const typeMap = {};
        exams.forEach((item) => {
            const date = new Date(item.createdAt);
            if (date.getFullYear() === selectedYear) {
                typeMap[item.examType] = (typeMap[item.examType] || 0) + 1;
            }
        });
        return typeMap;
    };

    const extractYearsFromExams = (data) => {
        const years = [...new Set(data.map((item) => new Date(item.createdAt).getFullYear()))];
        setYearExists(years.sort((a, b) => b - a));
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/AccountUser/me/exams');

            console.log('Dashboard exams response:', response.data.data);
            if (response.data.success) {
                const exams = response.data.data?.filter(Boolean) || [];
                setAllExams(exams);
                extractYearsFromExams(exams);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to fetch exam data.',
                });
            }
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    // Không cần updateChartsForYear nữa

    const onYearChange = (year) => {
        setSelectedYear(year);
        setDropdownVisible(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    // Không cần các hàm chart nữa

    // Tính toán thống kê
    const monthLabels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    const monthStats = getMonthStats(allExams);
    const subjectStats = getSubjectStats(allExams);
    const examTypeStats = getExamTypeStats(allExams);
    const totalExams = allExams.filter((item) => new Date(item.createdAt).getFullYear() === selectedYear).length;
    const totalQuestions = allExams.filter((item) => new Date(item.createdAt).getFullYear() === selectedYear).reduce((sum, item) => sum + (item.questionCount || 0), 0);

    return (
        <View className="flex-1 bg-gray-100 relative">
            <StatusBar backgroundColor="#F3F4F6" barStyle="dark-content" />
            <View className="absolute bottom-0 left-0 right-0" style={{ zIndex: 0 }}>
                <Image source={bg1} style={{ width, height: height * 0.8 }} resizeMode="cover" />
            </View>

            {/* Header */}
            <View className="flex-row items-center mt-6 px-4 pt-12 bg-transparent" style={{ zIndex: 1 }}>
                <TouchableOpacity onPress={handleBack} className="flex-row items-center p-3">
                    <Ionicons name="chevron-back-outline" size={28} color="#3B82F6" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-gray-900">Dashboard</Text>
            </View>

            <ScrollView className="px-6 pb-10" contentContainerStyle={{ paddingBottom: 80 }}>
                {/* Dropdown chọn năm */}
                {yearExists && yearExists.length > 0 && (
                    <View className="flex-row justify-between items-center mt-6 mb-4">
                        <Text className="text-lg font-bold text-gray-800">Năm thống kê</Text>
                        <View className="relative">
                            <TouchableOpacity
                                onPress={() => setDropdownVisible(!dropdownVisible)}
                                className="px-3 py-1 bg-gray-100 rounded-full flex-row items-center"
                            >
                                <Text className="text-sm text-gray-600 mr-1">{selectedYear}</Text>
                                <Ionicons name="chevron-down-outline" size={14} color="#6B7280" />
                            </TouchableOpacity>
                            {dropdownVisible && (
                                <View className="absolute top-10 right-0 bg-white rounded-xl shadow-lg z-50">
                                    {yearExists.map((year) => (
                                        <TouchableOpacity
                                            key={`year-${year}`}
                                            onPress={() => onYearChange(year)}
                                            className="px-4 py-2"
                                        >
                                            <Text className={`text-sm ${selectedYear === year ? 'text-blue-500 font-bold' : 'text-gray-700'}`}>
                                                {year}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* Tổng quan */}
                <View className="bg-white rounded-xl p-4 mb-6 shadow">
                    <Text className="text-lg font-bold mb-2">Tổng quan</Text>
                    <Text className="text-base text-gray-700">Tổng số bài kiểm tra: <Text className="font-bold text-blue-600">{totalExams}</Text></Text>
                    <Text className="text-base text-gray-700">Tổng số câu hỏi: <Text className="font-bold text-blue-600">{totalQuestions}</Text></Text>
                </View>

                {/* Thống kê số bài kiểm tra theo tháng */}
                <View className="bg-white rounded-xl p-4 mb-6 shadow">
                    <Text className="text-lg font-bold mb-2">Số bài kiểm tra theo tháng</Text>
                    {/* Biểu đồ cột: Tailwind, scroll ngang, không overflow */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 px-2">
                        <View className="flex-row items-end" style={{ height: 250 }}>
                            {monthStats.map((count, idx) => {
                                const max = Math.max(20, ...monthStats);
                                // Tăng chiều cao cột lên gấp 5 lần (từ 90 lên 450)
                                const barHeight = max > 0 ? (count / max) * 200 : 0;
                                return (
                                    <View key={idx} className="w-10 items-center justify-end mx-1">
                                        {/* Số lượng trên đầu cột */}
                                        {count > 0 && (
                                            <Text className="text-xs font-bold text-gray-800 mb-1">{count}</Text>
                                        )}
                                        <View
                                            className="w-4 rounded-full mb-2"
                                            style={{ height: barHeight, backgroundColor: '#4461F2', opacity: count === 0 ? 0.25 : 1 }}
                                        />
                                        <Text className="text-[11px] text-blue-600 text-center font-semibold mt-1">{monthLabels[idx].replace('Tháng ', '')}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                    {/* Bảng số liệu */}

                </View>

                {/* Thống kê theo môn học */}
                <View className="bg-white rounded-xl p-4 mb-6 shadow">
                    <Text className="text-lg font-bold mb-2">Số câu hỏi theo môn học</Text>
                    {Object.keys(subjectStats).length === 0 ? (
                        <Text className="text-gray-500">Không có dữ liệu</Text>
                    ) : (
                        Object.entries(subjectStats).map(([subject, count]) => (
                            <Text key={subject} className="text-gray-700">{subject}: <Text className="font-bold">{count}</Text></Text>
                        ))
                    )}
                </View>

                {/* Thống kê theo loại bài kiểm tra */}
                <View className="bg-white rounded-xl p-4 mb-6 shadow">
                    <Text className="text-lg font-bold mb-2">Số bài kiểm tra theo loại</Text>
                    {Object.keys(examTypeStats).length === 0 ? (
                        <Text className="text-gray-500">Không có dữ liệu</Text>
                    ) : (
                        Object.entries(examTypeStats).map(([type, count]) => (
                            <Text key={type} className="text-gray-700">{type}: <Text className="font-bold">{count}</Text></Text>
                        ))
                    )}
                </View>


            </ScrollView>
        </View>
    );
};

export default DashboardScreen;
