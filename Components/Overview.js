import React, { useEffect, useState } from 'react';
import { Text, View, Button, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const Overview = ({ route, navigation }) => {
  var username
  if (route.params) {
     username = route.params.username;
  }
  const handleLogout = () => {
    navigation.navigate('Login');
  };
  const [songs, setSongs] = useState([]);
  const [sortBy, setSortBy] = useState(''); // State to store the selected sorting option

  useEffect(() => {
    // Check if the username exists (user is logged in)
    if (!username) {
      // Redirect to the Login screen
      navigation.navigate('Login');
    } else {
      axios
        .get(process.env.EXPO_PUBLIC_API_URL, {
          params: { action: 'overview', sort_by: sortBy },
        })
        .then((response) => {
          // Group songs by artist and song
          const groupedSongs = groupSongs(response.data);
          // Calculate average rating for each group
          const averagedSongs = calculateAverageRatings(groupedSongs);
          setSongs(averagedSongs);
          console.log(averagedSongs);
        })
        .catch((error) => {
          console.error('Error fetching songs: ', error);
        });
    }
  }, [username, navigation, sortBy]);

  const groupSongs = (songs) => {
    // Group songs by artist and song
    const groupedSongs = {};
    songs.forEach((song) => {
      const key = `${song.artist}-${song.song}`;
      if (!groupedSongs[key]) {
        groupedSongs[key] = [];
      }
      groupedSongs[key].push(song);
    });
    return groupedSongs;
  };

  const calculateAverageRatings = (groupedSongs) => {
    // Calculate average rating for each group
    const averagedSongs = [];
    for (const key in groupedSongs) {
      if (groupedSongs.hasOwnProperty(key)) {
        const songs = groupedSongs[key];
        const averageRating =
          songs.reduce((sum, song) => sum + song.rating, 0) / songs.length;
        // Take the first song in the group to extract user and song details
        const firstSong = songs[0];
        averagedSongs.push({
          username: firstSong.username,
          artist: firstSong.artist,
          song: firstSong.song,
          rating: averageRating.toFixed(2), // Round to two decimal places
        });
      }
    }
    return averagedSongs;
  };

  const handleSort = (itemValue) => {
    setSortBy(itemValue);
  };

  const renderStars = (rating) => {
    const starCount = Math.round(rating);
    const stars = Array.from({ length: 5 }, (_, index) => (
      <Text key={index}>{index < starCount ? '★' : '☆'}</Text>
    ));
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const renderSongItem = (item, index) => (
    <View key={index} style={styles.songContainer}>
      <Text style={styles.songText}>{`${item.song}`}<Text style={{fontWeight: 'normal'}}> by {item.artist}</Text></Text>
      {renderStars(item.rating)}
    </View>
  );

  return (
    <View style={styles.container}>
      {username ? (
        <>
          <Text>{`Hi, ${username}!`}</Text>
          <Button title="Logout" onPress={handleLogout} />
          <Picker selectedValue={sortBy} onValueChange={handleSort}>
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Sort By Artist (A-Z)" value="artist" />
            <Picker.Item label="Sort By Artist (Z-A)" value="-artist" />
            <Picker.Item label="Sort By Rating (Low to High)" value="rating" />
            <Picker.Item label="Sort By Rating (High to Low)" value="-rating" />
          </Picker>
          <ScrollView>
            {songs.map((item, index) => renderSongItem(item, index))}
          </ScrollView>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  songContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  songText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
});

export default Overview;