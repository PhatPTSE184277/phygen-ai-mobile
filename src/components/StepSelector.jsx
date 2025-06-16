import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';

const StepSelector = ({ values, selectedValue, onValueChange }) => {
    const selectedIndex = values.indexOf(selectedValue);
    
    return (
        <View className='p-6'>
            {/* Labels */}
            <View className='flex-row justify-between mb-4'>
                {values.map((value, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onValueChange(value)}
                        className='items-center'
                    >
                        <Text className={`text-sm font-medium ${
                            selectedValue === value ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                            {value}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            {/* Track */}
            <View className='relative h-2 bg-gray-200 rounded-full'>
                <View 
                    className='absolute h-2 bg-blue-600 rounded-full'
                    style={{
                        width: `${(selectedIndex / (values.length - 1)) * 100}%`
                    }}
                />
                
                {values.map((value, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onValueChange(value)}
                        className='absolute w-6 h-6 -mt-2 rounded-full border-2 border-white'
                        style={{
                            left: `${(index / (values.length - 1)) * 100}%`,
                            marginLeft: -12,
                            backgroundColor: index <= selectedIndex ? '#3B82F6' : '#E5E7EB'
                        }}
                    />
                ))}
            </View>
        </View>
    );
};

export default StepSelector;