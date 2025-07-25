import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

const Link = ({ link, style }) => {
  return <Text style={[styles.link, style]}>{link}</Text>;
};

const styles = StyleSheet.create({
  link: {
    fontSize: 16,
    color: Colors.primaryDark,
    fontWeight: '500',
    marginTop: 5,
  },
});

export default Link;