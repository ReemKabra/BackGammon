import { View,SafeAreaView,ScrollView ,Text,TouchableOpacity} from 'react-native'
import { Stack,useRouter,Link } from 'expo-router'
import  LogIn  from './components/LogIn'
import { ChatScreen } from './components/ChatScreen'
  const index=()=>{
    return(
        <SafeAreaView>
          <Stack.Screen
          options={
          {
            headerShadowVisible: true,
            headerTitle:"Home"
          }
          }/>
          <ScrollView>
            <View>
            <LogIn/>
            </View>
      </ScrollView>
        </SafeAreaView>
    )
  }
  export default index
