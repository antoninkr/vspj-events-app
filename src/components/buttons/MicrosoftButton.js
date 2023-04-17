import React from 'react';
import { Image } from 'react-native';
import { Button } from '@rneui/themed';

const MicrosoftButton = ({ title, onPress }) => {
  return (
    <Button
      title={title}
      buttonStyle={{
        borderColor: '#5E5E5E',
        borderWidth: 2,
        padding: 12,
      }}
      type="outline"
      titleStyle={{ color: '#5E5E5E', marginLeft: 12 }}
      containerStyle={{
        width: 150,
        marginHorizontal: 12,
        marginVertical: 12,
        padding: 0,
      }}
      icon={
        <Image
          source={require('./../../../assets/ms-symbol.png')}
          fadeDuration={0}
          style={{ width: 25, height: 25 }}
        />
      }
      onPress={onPress}
    />
  );
};

export default MicrosoftButton;
