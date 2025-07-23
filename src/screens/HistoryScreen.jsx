import { Text, View, FlatList, Image, Dimensions, TextInput, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import bg1 from '../../assets/images/bg1.png';
import explore1 from '../../assets/images/explore1.png';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import axiosClient2 from '../apis/axiosClient2';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const HistoryScreen = () => {
    const navigation = useNavigation();
    const handleBack = () => navigation.goBack();

    const [loading, setLoading] = useState(false);
    const [examsData, setExamsData] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Định dạng thời gian đã qua
    const formatTimeAgo = (isoDateString) => {
        if (!isoDateString) return '-';
        const now = new Date();
        const date = new Date(isoDateString);
        const diffMs = now - date;
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

    const loadData = async (nextPage = 0, append = false) => {
        setLoading(true);
        try {
            const response = await axiosClient2.get(
                `/api/exams/my?page=${nextPage}&size=${size}&sortBy=id&sortDir=desc`
            );
            if (response.data && response.data.data && Array.isArray(response.data.data.content)) {
                setExamsData(response.data.data.content);
                setTotalPages(response.data.data.totalPages || 1);
            }
        } catch (_error) {
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
            loadData(page, false);
        }, [page])
    );

    // handleLoadMore is unused in classic paging, removed

    return (
        <View className="flex-1 bg-gray-100 relative">
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
            <View className='flex-row items-center mt-6 px-4 pt-4 bg-transparent' style={{ zIndex: 1 }}>
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

                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#3B82F6" className="mt-4 p-10" />
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={examsData}
                            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    onPress={() => navigation.navigate('ExamVersion', { examId: item.id })}
                                >
                                    <View className='bg-white flex-row rounded-xl p-4 gap-6 items-center mb-4'>
                                        <View className='bg-[#FFEBF0] p-4 px-6 rounded-xl'>
                                            <Image source={explore1} className="w-10 h-10" resizeMode="contain" />
                                        </View>
                                        <View>
                                            {/* ID nổi bật */}
                                            <Text style={{
                                                fontWeight: 'bold',
                                                fontSize: 18,
                                                color: '#2563EB',
                                                marginBottom: 2,
                                            }}>
                                                #{item.id}
                                            </Text>
                                            {/* examType nhỏ, phụ */}
                                            <Text style={{
                                                color: '#B8B8D2',
                                                fontSize: 14,
                                                marginBottom: 4,
                                            }}>
                                                {item.examType}
                                            </Text>
                                            <View className='flex-row items-center gap-2 mt-1'>
                                                <Ionicons
                                                    name="time-outline"
                                                    size={14}
                                                    color={"#B8B8D2"}
                                                />
                                                <Text className='text-[#B8B8D2] font-light text-sm'>
                                                    {formatTimeAgo(item.createAt)}
                                                </Text>
                                            </View>
                                            <Text className='text-[#B8B8D2] font-light text-sm mt-1'>
                                                {item.questionCount ? `${item.questionCount} questions` : ''}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            // Tắt load-more tự động, chỉ dùng phân trang thủ công
                            onEndReached={null}
                            onEndReachedThreshold={null}
                            // ListFooterComponent removed, not needed for classic paging
                            ListEmptyComponent={!loading && <Text style={{ textAlign: 'center', color: '#B8B8D2', marginTop: 32 }}>No exam history found.</Text>}
                            contentContainerStyle={{ paddingBottom: 24, paddingTop: 24 }}
                            showsVerticalScrollIndicator={false}
                            className='mt-6'
                        />
                        {/* Pagination controls */}
                        {totalPages > 1 && (
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 16 }}>
                                <TouchableOpacity
                                    onPress={() => page > 0 && setPage(page - 1)}
                                    disabled={page === 0}
                                    style={{ padding: 10, opacity: page === 0 ? 0.5 : 1 }}
                                >
                                    <Ionicons name="chevron-back" size={22} color="#3B82F6" />
                                </TouchableOpacity>
                                <Text style={{ marginHorizontal: 16, fontWeight: 'bold', color: '#3B82F6' }}>
                                    Page {page + 1} / {totalPages}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => page + 1 < totalPages && setPage(page + 1)}
                                    disabled={page + 1 >= totalPages}
                                    style={{ padding: 10, opacity: page + 1 >= totalPages ? 0.5 : 1 }}
                                >
                                    <Ionicons name="chevron-forward" size={22} color="#3B82F6" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                )}
            </View>
        </View>
    );
};

export default HistoryScreen;