import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

const TITLE: String = 'Testing APP Today';
const BODY: String =
  'to change this screen and then come back to see your edits. React Native.';

const Home: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
    <SafeAreaView>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView>
        <Header />
        <View>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: isDarkMode ? Colors.light : Colors.dark,
              },
            ]}>
            {TITLE}
          </Text>
          <Text>
            {BODY}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default Home;
