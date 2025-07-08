import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

const Box = ({ children, style }) => {
  return <View style={[styles.box, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: Colors.neutral0,
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral300,
    shadowColor: Colors.neutral400,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 20,
  },
});

export default Box;
