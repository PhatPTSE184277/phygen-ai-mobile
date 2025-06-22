import { Text, View } from 'react-native'

import { ScrollView, Image, Dimensions, TextInput, TouchableOpacity } from 'react-native';

import { StatusBar } from 'react-native';

import { BarChart, PieChart } from 'react-native-gifted-charts';

import { Ionicons } from '@expo/vector-icons';

import bg1 from '../../assets/images/bg1.png';
import { useNavigation } from '@react-navigation/native';

import React, { useState } from 'react';

const { width, height } = Dimensions.get('window');
const DashboardScreen = () => {
    const navigation = useNavigation();
    const handleBack = () => {
        navigation.goBack();
    };


    const barData = [
        { value: 19990, label: 'April', frontColor: '#A689FC' },
        { value: 17250, label: 'May', frontColor: '#A689FC' },
        { value: 14650, label: 'June', frontColor: '#A689FC' },
        { value: 11230, label: 'July', frontColor: '#A689FC' },
        { value: 9856, label: 'Aug', frontColor: '#A689FC' },
        { value: 8600, label: 'Sep', frontColor: '#A689FC' },
    ];

    const pieData = [
        { value: 30, color: '#9787FF', text: 'Grade 10' },
        { value: 35, color: '#FFA5DA', text: 'Grade 11' },
        { value: 35, color: '#00BCD4', text: 'Grade 12' },
    ];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedSlice, setSelectedSlice] = useState(pieData[0]);

    const getUpdatedPieData = () => {
        return pieData.map((item, index) => ({
            ...item,
            focused: index === selectedIndex,
        }));
    };
    return (
        <>
            <View className="flex-1 bg-gray-100 relative"  >
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
                    className='flex-row items-center mt-6 px-4 pt-12  bg-transparent'
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
                        Dashboard
                    </Text>
                </View>
                <View className='px-8 flex-1'>
                    <View className="justify-center  mt-4 mb-6">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold text-gray-800">Exams</Text>
                            <TouchableOpacity className="px-3 py-1 bg-gray-100 rounded-full">
                                <Text className="text-sm text-gray-500">6 months ▼</Text>
                            </TouchableOpacity>
                        </View>

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
                            maxValue={25000}
                            stepValue={5000}
                            hideRules
                            renderTooltip={(item, index) => {
                                return (
                                    <View
                                        style={{
                                            marginBottom: 16,
                                            marginLeft: -12,
                                            backgroundColor: 'rgba(100, 61, 255, 0.9)',
                                            paddingHorizontal: 10,
                                            paddingVertical: 6,
                                            borderRadius: 8,
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.5,
                                            elevation: 5,
                                            transform: [{ scale: 1 }],
                                        }}
                                    >
                                        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>
                                            {item.value}
                                        </Text>
                                    </View>
                                );
                            }}
                        />
                    </View>

                    {/* Pie Chart */}
                    <View className="p-4 rounded-2xl">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold text-gray-800">Grade</Text>
                            <TouchableOpacity className="px-3 py-1 bg-gray-100 rounded-full">
                                <Text className="text-sm text-gray-500">6 months ▼</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="items-center">
                            <PieChart
                                data={getUpdatedPieData()}
                                donut
                                radius={90}
                                innerRadius={60}
                                innerCircleColor={'#F3F4F6'}
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

                        {/* Legend */}
                        <View className="flex-row justify-center space-x-6 mt-4">
                            {pieData.map((item, index) => (
                                <View key={index} className="flex-row items-center space-x-1 mr-6">
                                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color, marginRight: 4 }} />
                                    <Text className="text-sm text-gray-600">{item.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                </View>



            </View>
        </>
    )
}

export default DashboardScreen

