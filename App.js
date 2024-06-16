import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MainScreen from './screens/mainScreen';
import DrawScreen from './screens/DrawScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InitScreen from './screens/InitScreen';
import { GameContextProvider } from './gameContext';

const Stack = createNativeStackNavigator();



export default function App() {
  return (
    <GameContextProvider>

      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "fade_from_bottom",
          }}
          initialRouteName="Init"
        >
          <Stack.Screen name='Init' component={InitScreen} />
          <Stack.Screen name='Main' component={MainScreen} />
          <Stack.Screen name='Drawing' component={DrawScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
