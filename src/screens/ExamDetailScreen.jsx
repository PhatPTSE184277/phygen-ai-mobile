import { View, Text, StatusBar, TouchableOpacity, useWindowDimensions, Image, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';
import bg1 from '../../assets/images/bg1.png';
import { useState } from 'react';

const ExamDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const exam = route.params?.exam;
    const { width, height } = useWindowDimensions();
    const [loading, setLoading] = useState(false);

    const pdfSource =
        Platform.OS === 'android'
            ? { uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(exam?.pdfUrl)}` }
            : { uri: exam?.pdfUrl };

    const handleDownloadPdf = async () => {
        setLoading(true);
        try {
            const downloadUrl = exam?.pdfUrl;
            if (!downloadUrl) throw new Error('Không có link PDF!');
            const fileName = `exam_${exam.examCode}.pdf`;
            const tempPath = FileSystem.documentDirectory + fileName;
            const downloadResumable = FileSystem.createDownloadResumable(
                downloadUrl,
                tempPath
            );
            await downloadResumable.downloadAsync();

            let destUri = tempPath;
            try {
                if (Platform.OS === 'android') {
                    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                    if (permissions.granted) {
                        const baseUri = permissions.directoryUri;
                        destUri = await FileSystem.StorageAccessFramework.createFileAsync(baseUri, fileName, 'application/pdf');
                        await FileSystem.writeAsStringAsync(
                            destUri,
                            await FileSystem.readAsStringAsync(tempPath, { encoding: FileSystem.EncodingType.Base64 }),
                            { encoding: FileSystem.EncodingType.Base64 }
                        );
                        Toast.show({
                            type: 'success',
                            text1: 'Đã lưu PDF vào thư mục Files/Downloads!',
                            position: 'top'
                        });
                    } else {
                        await Sharing.shareAsync(tempPath);
                    }
                } else {
                    await Sharing.shareAsync(tempPath);
                }
            } catch (e) {
                await Sharing.shareAsync(tempPath);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Tải PDF thất bại!',
                text2: error?.message || 'Please try again.',
                position: 'top'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className='flex-1 bg-gray-100 relative'>
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
            <View className='flex-row items-center mt-6 px-4 pt-12 bg-transparent' style={{ zIndex: 1 }}>
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
                    {exam?.examCode || 'Exam Detail'}
                </Text>
            </View>
            <View className='flex-1 px-6' style={{ zIndex: 1 }}>
                {exam?.pdfUrl ? (
                    <WebView
                        source={pdfSource}
                        style={{ flex: 1 }}
                        startInLoadingState={true}
                        renderLoading={() => (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="large" color="#3B82F6" />
                                <Text style={{ marginTop: 10, fontSize: 16, color: '#3B82F6' }}>Loading PDF...</Text>
                            </View>
                        )}
                        // Fix lỗi trắng trên Android khi dùng Google Docs Viewer
                        originWhitelist={['*']}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                    />
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: 'red' }}>Không tìm thấy file PDF!</Text>
                    </View>
                )}
            </View>
            <View className='px-6 pb-6' style={{ zIndex: 1 }}>
                <TouchableOpacity
                    className='bg-blue-600 rounded-2xl py-4 items-center flex-row justify-center'
                    activeOpacity={0.85}
                    onPress={loading ? undefined : handleDownloadPdf}
                    disabled={loading}
                    style={{ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 }}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="download-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                                Download PDF
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ExamDetailScreen;