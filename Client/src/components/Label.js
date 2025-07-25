import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

const Label = ({ label, style }) => {
  return <Text style={[styles.label, style]}>{label}</Text>;
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral700,
    marginBottom: 4,
  },
});

export default Label;