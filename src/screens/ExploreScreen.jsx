import { Text, View } from 'react-native'
import { useState } from 'react'
import { ScrollView, Image, Dimensions, TextInput, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import bg1 from '../../assets/images/bg1.png';
import explore1 from '../../assets/images/explore1.png';
import explore2 from '../../assets/images/explore2.png';
import explore3 from '../../assets/images/explore3.png';
const { width, height } = Dimensions.get('window');
const ExploreScreen = () => {
    const [activeTab, setActiveTab] = useState('Explore');
    const [activeType, setActiveType] = useState('All');
    return (
        <>
            <View className="flex-1 bg-gray-100 relative"  >

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
                <View className='p-8 pt-14 flex-1'>
                    <Text className="text-2xl font-bold ">Explore</Text>

                    <View className='mt-6'>
                        <View className="flex-row items-center bg-white rounded-2xl px-4 py-1">
                            <Ionicons name="search" size={18} color="#B8B8D2" />
                            <TextInput
                                placeholder="Find Exams"
                                placeholderTextColor="#B8B8D2"
                                className="flex-1 p-3 text-black"
                            />
                            <Ionicons name="options-outline" size={20} color="#B8B8D2" />
                        </View>

                    </View>

                    <View className="flex-row justify-between w-full mt-6 space-x-3 gap-3">

                        <View

                            className="w-28 h-24 bg-[#CEECFE] rounded-xl px-3 pt-3 relative overflow-hidden"
                        >
                            <Image
                                source={explore1}
                                className="w-full h-full absolute top-0 left-0"
                                resizeMode="contain"
                            />
                            <View className="absolute bottom-2 right-0">
                                <View className="px-2 py-1 rounded-l-md bg-[#F3FBFF]">
                                    <Text className="text-xs font-bold text-[#333]">Grade 10</Text>
                                </View>
                            </View>
                        </View>
                        <View
                            className="w-28 h-24 bg-[#EFE0FF] rounded-xl px-3 pt-3 relative overflow-hidden"
                        >
                            <Image
                                source={explore2}
                                className="w-full h-full absolute top-0 left-0"
                                resizeMode="contain"
                            />
                            <View className="absolute bottom-2 right-0">
                                <View className="px-2 py-1 rounded-l-md bg-[#F3FBFF]">
                                    <Text className="text-xs font-bold text-[#333]">Grade 11</Text>
                                </View>
                            </View>
                        </View>
                        <View

                            className="w-28 h-24 bg-[#BFE3C6] rounded-xl px-3 pt-3 relative overflow-hidden"
                        >
                            <Image
                                source={explore3}
                                className="w-full h-full absolute top-0 left-0"
                                resizeMode="contain"
                            />
                            <View className="absolute bottom-2 right-0">
                                <View className="px-2 py-1 rounded-l-md bg-[#F3FBFF]">
                                    <Text className="text-xs font-bold text-[#333]">Grade 12</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <Text className="text-lg font-medium mt-6 mb-4 ">Popular Exams</Text>
                    <View className='flex-row items-center gap-2 mb-4'>
                        <TouchableOpacity onPress={() => setActiveType('All')}>
                            <View
                                className={`px-4 py-2 rounded-full ${activeType === 'All' ? 'bg-[#3D5CFF]' : 'bg-white'
                                    }`}
                            >
                                <Text
                                    className={`text-sm font-semibold ${activeType === 'All' ? 'text-white' : 'text-gray-700'
                                        }`}
                                >
                                    All
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setActiveType('New')}>
                            <View
                                className={`px-4 py-2 rounded-full ${activeType === 'New' ? 'bg-[#3D5CFF]' : 'bg-white'
                                    }`}
                            >
                                <Text
                                    className={`text-sm font-semibold ${activeType === 'New' ? 'text-white' : 'text-gray-700'
                                        }`}
                                >
                                    New
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveType('Popular')}>
                            <View
                                className={`px-4 py-2 rounded-full ${activeType === 'Popular' ? 'bg-[#3D5CFF]' : 'bg-white'
                                    }`}
                            >
                                <Text
                                    className={`text-sm font-semibold ${activeType === 'Popular' ? 'text-white' : 'text-gray-700'
                                        }`}
                                >
                                    Popular
                                </Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 60,
                        }}>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <View key={index} className='bg-white flex-row rounded-xl p-4 gap-6 items-center mb-4'>
                                <View className='bg-[#FFEBF0] p-4 px-6 rounded-xl'>
                                    <Image source={explore1} className="w-10 h-10" resizeMode="contain" />
                                </View>
                                <View>
                                    <Text >Dao Dong Co Hoc</Text>
                                    <View className='flex-row items-center gap-2 mt-1'>
                                        <Ionicons
                                            name="person"
                                            size={14}
                                            color={"#B8B8D2"}
                                        />
                                        <Text className='text-[#B8B8D2] font-light text-sm'> Alex</Text>
                                    </View>
                                    <Text className='text-[#B8B8D2] font-light text-sm mt-1'> 5 questions</Text>
                                </View>

                            </View>
                        ))}

                    </ScrollView>
                </View>



            </View>
        </>
    )
}

export default ExploreScreen

