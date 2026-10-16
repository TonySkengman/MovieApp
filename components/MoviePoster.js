
import { View, Text, Image, StyleSheet } from 'react-native';

export default function MoviePoster({
  uri,
  width = '100%',
  height = 300,
  placeholderText = 'No image available',
  placeholderFontSize = 16,
  placeholderHeight = height,
  borderRadius = 6,
}) {
  const posterStyle = {
    width,
    height,
    borderRadius,
  };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.poster, posterStyle]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        {
          width,
          height: placeholderHeight,
          borderRadius,
        },
      ]}
    >
      <Text
        style={[
          styles.placeholderText,
          { fontSize: placeholderFontSize },
        ]}
      >
        {placeholderText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  poster: {
    backgroundColor: '#222222',
  },
  placeholder: {
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  placeholderText: {
    color: '#aaaaaa',
    textAlign: 'center',
  },
});
