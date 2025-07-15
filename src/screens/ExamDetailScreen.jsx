import { View, Text, ScrollView, StatusBar, TouchableOpacity, useWindowDimensions, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderHtml from 'react-native-render-html';
import { useRoute, useNavigation } from '@react-navigation/native';
import axiosClient2 from '../apis/axiosClient2';
import Toast from 'react-native-toast-message';
import bg1 from '../../assets/images/bg1.png';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

const ExamDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const exam = route.params?.exam;
    const { width, height } = useWindowDimensions();


    const createPdfFromHtml = async (htmlContent, fileName) => {
        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
            base64: false,
        });
        return uri;
    };

    const handleDownloadPdf = async () => {
        try {
            // 1. Tạo PDF từ nội dung đề
            const htmlContent = exam?.examContentMarkdown
                ? exam.examContentMarkdown.replace(/\\n/g, '<br>')
                : '<p>No content</p>';
            const pdfPath = await createPdfFromHtml(htmlContent, exam.examCode);

            // 2. Upload PDF lên backend
            const formData = new FormData();
            formData.append('file', {
                uri: pdfPath,
                type: 'application/pdf',
                name: `exam_${exam.examCode}.pdf`,
            });
            formData.append('examVersionJson', JSON.stringify({
                versionCode: exam.examCode,
                nameBucket: 'default'
            }));
            console.log('FormData:', formData);
            console.log('PDF Path:', pdfPath);
            console.log('Exam Version JSON:', JSON.stringify({
                versionCode: exam.examCode,
                nameBucket: 'default'
            }));
            console.log('Exam id: ', exam.examId)

            const response = await axiosClient2.post(
                `/api/examVersion/exam/${exam.examId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );


            // 3. Xử lý response từ backend
            if (response.data?.success && response.data?.data?.pdfUrl) {
                const downloadUrl = response.data.data.pdfUrl;
                const localPath = FileSystem.documentDirectory + `exam_${exam.examCode}.pdf`;

                // Tải file PDF từ link online về máy
                const downloadResumable = FileSystem.createDownloadResumable(
                    downloadUrl,
                    localPath
                );
                await downloadResumable.downloadAsync();

                Toast.show({
                    type: 'success',
                    text1: 'PDF đã tải về máy!',
                    text2: `File: exam_${exam.examCode}.pdf`,
                    position: 'top'
                });

                // Tùy chọn: mở file PDF vừa tải
                setTimeout(() => {
                    Linking.openURL(localPath);
                }, 1000);

            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Upload failed!',
                    text2: response.data?.message || 'Không nhận được link PDF.',
                    position: 'top'
                });
            }
        } catch (error) {
            console.log('Axios error:', error);
            Toast.show({
                type: 'error',
                text1: 'Upload failed!',
                text2: error.message || 'Please try again.',
                position: 'top'
            });
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
            <ScrollView className='flex-1 px-6' style={{ zIndex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 24,
                        padding: 20,
                        marginTop: 18,
                        marginBottom: 18,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.10,
                        shadowRadius: 12,
                        elevation: 8,
                    }}
                >
                    <RenderHtml
                        contentWidth={width}
                        source={{
                            html:
                                exam?.examContentMarkdown
                                    ? exam.examContentMarkdown.replace(/\n/g, '<br>')
                                    : '<p>No content</p>'
                        }}
                        ignoredDomTags={['center']}
                    />
                </View>
            </ScrollView>
            <View className='px-6 pb-6' style={{ zIndex: 1 }}>
                <TouchableOpacity
                    className='bg-blue-600 rounded-2xl py-4 items-center flex-row justify-center'
                    activeOpacity={0.85}
                    onPress={handleDownloadPdf}
                    style={{ shadowColor: '#2563EB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 }}
                >
                    <Ionicons name="download-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                        Download PDF
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ExamDetailScreen;