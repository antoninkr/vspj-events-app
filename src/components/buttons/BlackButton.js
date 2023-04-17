import React from 'react';
import { Button } from '@rneui/themed';

const BlackButton = ({ title, onPress }) => {
  return (
    <Button
      title={title}
      buttonStyle={{
        borderColor: 'black',
        borderWidth: 2,
      }}
      type="outline"
      titleStyle={{ color: 'black', fontSize: 20 }}
      containerStyle={{
        width: 200,
        marginHorizontal: 50,
        marginVertical: 10,
      }}
      onPress={onPress}
    />
  );
};

export default BlackButton;
