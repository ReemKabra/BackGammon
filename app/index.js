import { View,SafeAreaView,ScrollView} from 'react-native'
import { Stack} from 'expo-router'
import  LogIn  from './components/LogIn'

  const index=()=>{
    return(
        <SafeAreaView>
          <Stack.Screen
          options={
          {
            headerShadowVisible: true,
            headerTitle:"Welcome"
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
