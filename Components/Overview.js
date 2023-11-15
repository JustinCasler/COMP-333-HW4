import React, { useEffect, useState } from 'react';
import { Text, View, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const Overview = ({ route, navigation }) => {
  var username
  if (route.params) {
    username = route.params.username;
  }
  const handleLogout = () => {
    navigation.navigate('Login');
  };
  const handleAddNew = () => {
    navigation.navigate('NewRating', { username: username });
  };
  const [songs, setSongs] = useState([]);
  const [sortBy, setSortBy] = useState(''); // State to store the selected sorting option
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0); // State to update song list after deletion

  useEffect(() => {
    // Check if the username exists (user is logged in)
    if (!username) {
      // Redirect to the Login screen
      navigation.navigate('Login');
    } else {
      const fetchData = async () => {
        try {
          const response = await axios.get(process.env.EXPO_PUBLIC_API_URL, {
            params: { action: 'overview', sort_by: sortBy },
          });
    
          const groupedSongs = groupSongs(response.data);
          const averagedSongs = calculateAverageRatings(groupedSongs);
          setSongs(averagedSongs);
          console.log(averagedSongs);
        } catch (error) {
          console.error('Error fetching songs: ', error);
        }
      };
    
      // Fetch data on initial render
      fetchData();

      // Fetch data when the component is focused (on navigation)
      const unsubscribe = navigation.addListener('focus', () => {
        fetchData();
      });

      return unsubscribe;
    }
  }, [username, navigation, sortBy, forceUpdateCounter]);

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
        // Extract all usernames in the group
        const usernamesInGroup = songs.map((song) => song.username);
        // extract song details
        const firstSong = songs[0];
        averagedSongs.push({
          username: usernamesInGroup,
          artist: firstSong.artist,
          song: firstSong.song,
          rating: averageRating.toFixed(2), // Round to two decimal places
          id: firstSong.ID,
        });
      }
    }
    return averagedSongs;
  };

  const handleSort = (itemValue) => {
    setSortBy(itemValue);
  };

  const handleDelete = (id) => {
    axios
        .post(process.env.EXPO_PUBLIC_API_URL, { id: id, action: "delete" })
        .then((response) => {
            if (response.data.status === 1) {
                // Rating was deleted
                // Increment the counter to trigger a re-render
                setForceUpdateCounter((prevCounter) => prevCounter + 1);
            } else {
                // Deletion failed, display the error message from the backend
                setMessage(response.data.message);
            }
        })
        .catch((error) => {
            setMessage("An error occurred while processing your request.");
        }); 
  };

  const handleSongClick = (item) => {
    navigation.navigate('Details', {
      song: item.song,
      artist: item.artist,
      rating: item.rating,
    });
  };

  const renderStars = (rating) => {
    const starCount = Math.round(rating);
    const stars = Array.from({ length: 5 }, (_, index) => (
      <Text key={index}>{index < starCount ? '★' : '☆'}</Text>
    ));
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const renderSongItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.songContainer}
      onPress={() => handleSongClick(item)}
    >
      <Text style={styles.songText}>{`${item.song}`}<Text style={{fontWeight: 'normal'}}> by {item.artist}</Text></Text>
      {renderStars(item.rating)}
      {item.username.includes(username) && (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={() => navigation.navigate('Update', { song: item.song, artist: item.artist, id: item.id, username: username})}>
              <Icon name="pencil" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Icon name="trash" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {username ? (
        <>
          <Text>{`Hi, ${username}!`}</Text>
          <Picker selectedValue={sortBy} onValueChange={handleSort}>
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Sort By Artist (A-Z)" value="artist" />
            <Picker.Item label="Sort By Artist (Z-A)" value="-artist" />
            <Picker.Item label="Sort By Song Title (A-Z)" value="song" />
            <Picker.Item label="Sort By Song Title (Z-A)" value="-song" />
          </Picker>
          <ScrollView>
            {songs.map((item, index) => renderSongItem(item, index))}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <View style={styles.bigbuttonWrapper}>
                <Button title="Add New" onPress={handleAddNew} />
            </View>
            <View style={styles.bigbuttonWrapper}>
                <Button title="Logout" onPress={handleLogout} />
            </View>
          </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }, 
  bigbuttonWrapper: {
    width: '30%',
  },
});

export default Overview;