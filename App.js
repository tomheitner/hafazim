import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MainScreen from './screens/mainScreen';
import DrawScreen from './screens/DrawScreen';
import ServerSCreen from './screens/ServerScreen';

export default function App() {
  return (
    <MainScreen />
    // <DrawScreen />
    // <ServerSCreen />
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
