import { Text, View } from 'react-native'

import { ScrollView, Image, Dimensions, TextInput, TouchableOpacity } from 'react-native';

import { StatusBar } from 'react-native';


import { Ionicons } from '@expo/vector-icons';

import bg1 from '../../assets/images/bg1.png';
import explore1 from '../../assets/images/explore1.png';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const HistoryScreen = () => {
    const navigation = useNavigation();
    const handleBack = () => {
        navigation.goBack();
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




                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 60,
                        }}
                        className='mt-6'>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <View key={index} className='bg-white flex-row rounded-xl p-4 gap-6 items-center mb-4'>
                                <View className='bg-[#FFEBF0] p-4 px-6 rounded-xl'>
                                    <Image source={explore1} className="w-10 h-10" resizeMode="contain" />
                                </View>
                                <View>
                                    <Text >Dao Dong Co Hoc</Text>
                                    <View className='flex-row items-center gap-2 mt-1'>
                                        <Ionicons
                                            name="time-outline"
                                            size={14}
                                            color={"#B8B8D2"}
                                        />
                                        <Text className='text-[#B8B8D2] font-light text-sm'> 3 days ago</Text>
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

export default HistoryScreen

