import { Text, View } from 'react-native'
import React from 'react'
import { ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator } from 'react-native';
import { useState } from 'react';
import bg1 from '../../assets/images/bg1.png';
import homepage1 from '../../assets/images/homepage1.png';
import homepage2 from '../../assets/images/homepage2.png';
import homepage3 from '../../assets/images/homepage3.png';



const { width, height } = Dimensions.get('window');
const HomeScreen = () => {

    const [activeTab, setActiveTab] = useState('Home');
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
                        <Text className="text-2xl font-bold text-white">Hi, NgocTHB</Text>
                        <Text className="text-lg font-light text-white">Let&apos;s start create exam</Text>
                    </View>
                    <Image
                        source={{ uri: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB1msOP5?w=0&h=0&q=60&m=6&f=jpg&u=t' }}
                        className="w-24 h-24 rounded-full border-4 border-white "
                    />
                </LinearGradient>


                <View className="bg-white absolute top-40 left-1/2 -translate-x-1/2 w-96 rounded-2xl shadow p-4 mt-6">
                    <View className='flex-row justify-between items-center mb-2'>
                        <Text className="text-gray-500 text-sm">Exams created today</Text>
                        <View className="flex-row justify-between items-center">

                            <TouchableOpacity>
                                <Text className="text-indigo-500 font-semibold">My exams</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text className="text-2xl font-bold">6 exams</Text>
                    <View className="bg-indigo-200 h-2 w-full rounded-full mt-2">

                        <View className="bg-indigo-600 h-2 w-1/2 rounded-full" />
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
                            <TouchableOpacity className="bg-indigo-500 px-3 py-2 rounded-full self-start">
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
                            <TouchableOpacity className="bg-indigo-500 px-3 py-2 rounded-full self-start">
                                <Text className="text-white text-sm font-semibold">Explore Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>



                <View className="mt-6 px-6">
                    <Text className="text-lg font-semibold mb-2">Creating Exam</Text>


                    <View className="bg-white rounded-xl p-4 mb-2 flex-row justify-between items-center">
                        <View>
                            <Text className="text-base font-semibold">15 minutes exam</Text>
                            <Text className="text-sm text-gray-500">40/48</Text>
                        </View>
                        <ActivityIndicator size="small" color="#6366F1" />
                    </View>


                    <View className="bg-white rounded-xl p-4 flex-row justify-between items-center">
                        <View>
                            <Text className="text-base font-semibold">Dao dong co hoc</Text>
                            <Text className="text-sm text-gray-500">6/24</Text>
                        </View>
                        <ActivityIndicator size="small" color="#6366F1" />
                    </View>
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
