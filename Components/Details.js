import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SongDetails = ({ route }) => {
  const { song, artist, rating } = route.params;

  // A function to render stars based on the rating
  const renderStars = (rating) => {
    const starCount = Math.round(rating);
    const stars = Array.from({ length: 5 }, (_, index) => (
      <Icon key={index} name={index < starCount ? 'star' : 'star-o'} size={20} color="gold" />
    ));
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Song Details</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Title</Text>
        <Text style={styles.input}>{song}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Artist</Text>
        <Text style={styles.input}>{artist}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Rating</Text>
        {renderStars(rating)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  detailContainer: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
});

export default SongDetails;


