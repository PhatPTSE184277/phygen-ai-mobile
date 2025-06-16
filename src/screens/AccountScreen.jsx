import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { ScrollView, Image, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import bg1 from '../../assets/images/bg1.png';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

const AccountScreen = () => {
    const [activeTab, setActiveTab] = useState('Account');
    const navigation = useNavigation();

    const handleMenuPress = (label) => {
        switch (label) {
            case 'Dashboard':
                 console.log('Navigate to Dashboard');
                break;
            case 'My Profile':
                console.log('Navigate to My Profile');
                break;
            case 'Generate':
                navigation.navigate('Generate');
                break;
            case 'History':
                console.log('Navigate to History');
                break;
            default:
                break;
        }
    };

    return (
        <>
            <SafeAreaView className="flex-1 bg-gray-100 relative">
                {/* Background Image */}
                <Image
                    source={bg1}
                    style={{
                        width: width,
                        height: height * 0.8,
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 0,
                    }}
                    resizeMode="cover"
                />

                <ScrollView className="flex-1 p-6 pt-10">
                    <Text className="text-2xl font-bold mb-6">My Account</Text>

                    {/* Avatar + Gradient */}
                    <View className="items-center mb-14">
                        <LinearGradient
                            colors={[
                                'rgba(88, 193, 202, 0.53)',
                                'rgba(67, 113, 222, 0.77)',
                                'rgba(115, 48, 222, 0.60)',
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ width: "100%", height: 112, borderRadius: 16 }}
                        />

                        <View className="absolute top-16">
                            <View className="w-24 h-24 rounded-full bg-white justify-center items-center shadow-md relative">
                                <Image
                                    source={{
                                        uri: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB1msOP5?w=0&h=0&q=60&m=6&f=jpg&u=t',
                                    }}
                                    className="w-20 h-20 rounded-full"
                                    resizeMode="cover"
                                />
                                <TouchableOpacity className="absolute bottom-0 right-1 bg-white p-1 rounded-full">
                                    <Ionicons name="camera" size={16} color="#7C4DFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View className="bg-white rounded-2xl p-4 mb-6 shadow-md border border-[#E2E8F0]">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="font-semibold text-lg text-[#333]">
                                Unlock all features with{'\n '}
                                <Text className="text-[#5932EA]">EXAMIFY</Text> Premium
                            </Text>
                            <Text className="text-xs bg-[#4461F2] text-white font-bold px-3 py-1 rounded-full">
                                Premium
                            </Text>
                        </View>
                        <Text className="text-base font-light mb-4 leading-5">
                            All-in-one tool for quick and easy test creation with full features.
                        </Text>
                        <TouchableOpacity className="bg-[#4461F2] rounded-xl py-3" onPress={() => navigation.navigate('Premium')}>
                            <Text className="text-center text-white font-bold tracking-wide text-base">
                                TRY NOW
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="px-4">
                        {['Dashboard', 'My Profile', 'Generate', 'History'].map((label, index) => (
                            <TouchableOpacity
                                key={index}
                                className="flex-row justify-between items-center py-4"
                                activeOpacity={0.7}
                                onPress={() => handleMenuPress(label)}
                            >
                                <Text className="text-lg font-medium">{label}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#858597" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default AccountScreen