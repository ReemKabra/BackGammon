import React from 'react';
import { View, StyleSheet } from 'react-native';
import Board from './GameBoard';

const Game = () => {
  return (
    <View style={styles.container}>
      <Board />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',  // Add a background color if you wish
  },
});

export default Game;