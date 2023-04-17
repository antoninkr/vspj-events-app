import React from 'react';
import { StyleSheet, View } from 'react-native';

const Spacer = ({ children, margin = 20 }) => {
  const styles = StyleSheet.create({
    spacer: {
      margin,
    },
  });

  return <View style={styles.spacer}>{children}</View>;
};

export default Spacer;
