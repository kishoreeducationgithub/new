import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { MovementPlayScreen } from '../screens/MovementPlayScreen'
import { toddlerTheme } from '../theme/toddlerTheme'

export function ToddlerMovementApp() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <MovementPlayScreen />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: toddlerTheme.colors.appBackground,
    flex: 1,
  },
})
