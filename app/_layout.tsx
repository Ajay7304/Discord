import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/components/useColorScheme';

import {StreamChat} from "stream-chat";
import { OverlayProvider, Chat, ChannelList, Channel, MessageList, MessageInput} from "stream-chat-expo";

const API_KEY = "jdt84drhah4m";

const client = StreamChat.getInstance(API_KEY);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [isReady, setIsReady] = useState(false);
  const connectUser = async ()=>{
  // Connect User
    await client.connectUser(
      {
        id:"Ajay",
        name:"Ajay",
        image:"https://images.app.goo.gl/6STHG75ZBi15zDjN9"
      },
      client.devToken("Ajay")
    )
    
    setIsReady(true);

    //Create Channel
    const channel = client.channel("team","general",{name:"General"});
    await channel.create();
  }

  useEffect(()=>{
    connectUser();
    console.log('User Connected')
  },[])
 


  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  // useEffect(() => {
  //   if (error) throw error;
  // }, [error]);

  useEffect(() => {
    if (loaded || isReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || !isReady) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [selectedChannel , setSelectedChannel] = useState(null)

  const onChannelSelect = (channel) => {
    setSelectedChannel(channel);
  }
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <OverlayProvider>
        <Chat client={client}>
          {!selectedChannel ? (<ChannelList onSelect={onChannelSelect} />) : (
            <Channel channel={selectedChannel}>
              <Text 
                style={{ margin: 50}}
                onPress={()=> setSelectedChannel(null)}
              >
                  GO BACK
              </Text>
              <MessageList/>
              <MessageInput/>
            </Channel>
          ) }
            
            {/* <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack> */}
        </Chat>
      </OverlayProvider>
    </GestureHandlerRootView>
  );
}
