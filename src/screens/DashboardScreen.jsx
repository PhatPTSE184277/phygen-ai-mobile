import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    StatusBar,
    ActivityIndicator
} from 'react-native';

import { BarChart, PieChart } from 'react-native-gifted-charts';
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
    const [barData, setBarData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [yearExists, setYearExists] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedSlice, setSelectedSlice] = useState(null);

    const handleBack = () => {
        navigation.goBack();
    };

    const convertToBarData = (data) => {
        const monthMap = Array(12).fill(0);
        data.forEach((item) => {
            const date = new Date(item.createdAt);
            const year = date.getFullYear();
            const month = date.getMonth(); // 0 - 11

            if (year === selectedYear) {
                monthMap[month] += item.questionCount;
            }
        });

        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return monthMap.map((value, index) => ({
            label: monthLabels[index],
            value,
            frontColor: '#A689FC',
        }));
    };


    const convertToPieData = (data) => {
        const subjectMap = {};
        data.forEach((item) => {
            const year = new Date(item.createdAt).getFullYear();
            if (year !== selectedYear) return;

            if (!subjectMap[item.subjectName]) subjectMap[item.subjectName] = 0;
            subjectMap[item.subjectName] += item.questionCount;
        });

        const total = Object.values(subjectMap).reduce((sum, val) => sum + val, 0);
        const colors = ['#9787FF', '#FFA5DA', '#00BCD4', '#FFD700', '#87CEEB'];

        return Object.entries(subjectMap).map(([name, count], index) => ({
            value: total > 0 ? Math.round((count / total) * 100) : 0,
            color: colors[index % colors.length],
            text: name,
        }));
    };

    const extractYearsFromExams = (data) => {
        const years = [...new Set(data.map((item) => new Date(item.createdAt).getFullYear()))];
        setYearExists(years.sort((a, b) => b - a));
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/AccountUser/me/exams');

            if (response.data.success) {
                const exams = response.data.data;
                setAllExams(exams);
                extractYearsFromExams(exams);
                updateChartsForYear(selectedYear, exams);
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

    const updateChartsForYear = (year, exams = allExams) => {
        const filtered = exams.filter((item) => new Date(item.createdAt).getFullYear() === year);
        const bar = convertToBarData(filtered);
        const pie = convertToPieData(filtered);
        setBarData(bar);
        setPieData(pie);
        setSelectedSlice(pie[0]);
        setSelectedIndex(0);
    };

    const onYearChange = (year) => {
        setSelectedYear(year);
        setDropdownVisible(false);
        updateChartsForYear(year);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const getUpdatedPieData = () =>
        pieData.map((item, index) => ({
            ...item,
            focused: index === selectedIndex,
        }));

    return (
        <View className="flex-1 bg-gray-100 relative">
            <StatusBar backgroundColor="#F3F4F6" barStyle="dark-content" />

            {/* Background Image */}
            <View className="absolute bottom-0 left-0 right-0" style={{ zIndex: 0 }}>
                <Image
                    source={bg1}
                    style={{ width: width, height: height * 0.8 }}
                    resizeMode="cover"
                />
            </View>

            {/* Header */}
            <View className="flex-row items-center mt-6 px-4 pt-12 bg-transparent" style={{ zIndex: 1 }}>
                <TouchableOpacity onPress={handleBack} className="flex-row items-center p-3">
                    <Ionicons name="chevron-back-outline" size={28} color="#3B82F6" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-gray-900">Dashboard</Text>
            </View>

            <ScrollView className="px-6 pb-10" contentContainerStyle={{ paddingBottom: 80 }}>
                {/* Dropdown */}
                <View className="flex-row justify-between items-center mt-6 mb-4">
                    <Text className="text-lg font-bold text-gray-800">Exams</Text>
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
                                        key={year}
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

                {/* Loading indicator */}
                {loading ? (
                    <ActivityIndicator size="large" color="#6B7280" className="mt-20" />
                ) : (
                    <>
                        {/* Bar Chart */}
                        <View className="mt-4">
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <BarChart
                                    barWidth={22}
                                    noOfSections={5}
                                    barBorderRadius={6}
                                    frontColor="#A689FC"
                                    data={barData}
                                    yAxisTextStyle={{ color: '#9CA3AF' }}
                                    xAxisLabelTextStyle={{ color: '#6B7280', fontSize: 12 }}
                                    spacing={24}
                                    isAnimated
                                    stepValue={5}
                                    hideRules={false}
                                    renderTooltip={(item) => (
                                        <View
                                            style={{
                                                marginBottom: 16,
                                                marginLeft: -12,
                                                backgroundColor: 'rgba(100, 61, 255, 0.9)',
                                                paddingHorizontal: 10,
                                                paddingVertical: 6,
                                                borderRadius: 8,
                                            }}
                                        >
                                            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>
                                                {item.value} câu hỏi
                                            </Text>
                                        </View>
                                    )}
                                    width={barData.length * 50} // Chiều rộng toàn bộ biểu đồ, tính theo số lượng tháng
                                />
                            </ScrollView>
                        </View>


                        {/* Pie Chart */}
                        <View className="mt-8">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-lg font-bold text-gray-800">Grade</Text>

                            </View>

                            <View className="items-center">
                                <PieChart
                                    data={getUpdatedPieData()}
                                    donut
                                    radius={90}
                                    innerRadius={60}
                                    innerCircleColor="#F3F4F6"
                                    sectionAutoFocus
                                    initialSelectedIndex={0}
                                    focusedOuterRadius={110}
                                    onPress={(item, index) => {
                                        setSelectedSlice(item);
                                        setSelectedIndex(index);
                                    }}
                                    centerLabelComponent={() => (
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 22, color: 'black', fontWeight: 'bold' }}>
                                                {selectedSlice?.value || 0}%
                                            </Text>
                                            <Text style={{ fontSize: 14, color: 'gray' }}>
                                                {selectedSlice?.text || ''}
                                            </Text>
                                        </View>
                                    )}
                                />
                            </View>

                            {/* Pie Legend */}
                            <View className="flex-row justify-center flex-wrap mt-4">
                                {pieData.map((item, index) => (
                                    <View key={index} className="flex-row items-center mr-6 mb-2">
                                        <View
                                            style={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: 5,
                                                backgroundColor: item.color,
                                                marginRight: 4,
                                            }}
                                        />
                                        <Text className="text-sm text-gray-600">{item.text}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

export default DashboardScreen;
