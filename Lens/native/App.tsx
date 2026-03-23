import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { MovementPlayScreen } from './src/screens/MovementPlayScreen'

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <MovementPlayScreen />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eef5df',
  },
})
