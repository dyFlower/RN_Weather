import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_KEY = '8a8902975e512334c590897ce19e6989';

export default function App() {
  const [city, setCity] = useState('Loading...');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWheather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false },
    );
    setCity(location[0].city);
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
    );
    const json = await res.json();
    setDays(json);
    console.log(days);
  };
  useEffect(() => {
    getWheather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.wheater}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color='white' size='large' />
          </View>
        ) : (
          <View style={styles.day}>
            <Text style={styles.temp}>{parseFloat(days.main.temp).toFixed(1)}</Text>
            <Text style={styles.description}>{days.weather[0].main}</Text>
            <Text style={styles.tinyDesc}>{days.weather[0].description}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'skyblue' },
  city: { flex: 1.1, justifyContent: 'center', alignItems: 'center' },
  cityName: { fontSize: 58, fontWeight: 500 },
  wheater: {},
  day: { width: SCREEN_WIDTH, alignItems: 'center' },
  temp: { fontSize: 178, fontWeight: '600', marginTop: 50 },
  description: { fontSize: 60, marginTop: -30 },
  tinyDesc: { fontSize: 20 },
});
