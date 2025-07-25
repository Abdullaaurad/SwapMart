import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import Error from '../components/Error';
import Label from '../components/Label';

const FormInput = ({
  label,
  iconName,
  error,
  secureTextEntry,
  containerStyle,
  inputWrapperStyle,
  inputTextStyle,
  ...props
}) => {
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  return (
    <View style={[styles.container, containerStyle]}>
      <Label label={label} />
      <View style={[styles.inputWrapper, inputWrapperStyle]}>
        {iconName && (
          <Icon
            name={iconName}
            size={25}
            color={Colors.neutral500}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.textInput,
            secureTextEntry && styles.passwordInput,
            inputTextStyle,
          ]}
          placeholderTextColor={Colors.neutral500}
          secureTextEntry={hidePassword}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
            style={styles.eyeIcon}
          >
            <Icon
              name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.neutral500}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Error title={error} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral0,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.neutral300,
  },
  icon: {
    marginRight: 12,
    color: Colors.primary,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral1000,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
});

export default FormInput;
