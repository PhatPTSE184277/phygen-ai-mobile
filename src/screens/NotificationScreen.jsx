import { Text, View } from 'react-native'
import { useState } from 'react'
import { ScrollView, Image, Dimensions } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import Footer from '~/components/Footer';
import bg1 from '../../assets/images/bg1.png';

const { width, height } = Dimensions.get('window');
const NotificationScreen = () => {
    const [activeTab, setActiveTab] = useState('Notification');
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
                <View className='p-8 pt-14'>
                    <Text className="text-2xl font-bold ">Notifications</Text>

                </View>
                <ScrollView className='px-6 ' showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 10 }).map((_, index) => (<View key={index}>
                        <View className='bg-white flex-row rounded-xl p-4 gap-6 items-center mb-4'>
                            <View className='bg-[#FFEBF0] p-4 px-6 rounded-xl'>
                                <Ionicons
                                    name="card"
                                    size={24}
                                    color={"#FF6905"}
                                />
                            </View>
                            <View>
                                <Text >Successful purchase!</Text>
                                <View className='flex-row items-center gap-2 mt-1'>
                                    <Ionicons
                                        name="time"
                                        size={14}
                                        color={"#B8B8D2"}
                                    />
                                    <Text className='text-[#B8B8D2] font-light text-sm'> Just now</Text>
                                </View>
                            </View>

                        </View>
                        <View className='bg-white flex-row rounded-xl p-4 gap-6 items-center mb-4'>
                            <View className='bg-[#EAEAFF] p-4 px-6 rounded-xl'>
                                <Ionicons
                                    name="chatbubble-ellipses"
                                    size={24}
                                    color={"#3D5CFF"}
                                />
                            </View>
                            <View>
                                <Text >Your exam has been created!</Text>
                                <View className='flex-row items-center gap-2 mt-1'>
                                    <Ionicons
                                        name="time"
                                        size={14}
                                        color={"#B8B8D2"}
                                    />
                                    <Text className='text-[#B8B8D2] font-light text-sm'> Just now</Text>
                                </View>
                            </View>

                        </View></View>
                    ))}

                </ScrollView>


            </View>
            <Footer activeTab={activeTab} onTabPress={setActiveTab} />
        </>
    )
}

export default NotificationScreen

