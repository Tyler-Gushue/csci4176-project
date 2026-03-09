import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';

import { HomeScreen } from './screens/Home.js'
import { PostScreen } from './screens/Post.js'
import { ProfileScreen } from './screens/Profile.js'
import { FriendsScreen } from './screens/Friends.js'
import { MapScreen } from './screens/Map.js'
import { Login } from './screens/Login.js'
import { Signup } from './screens/Signup.js'


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();

export function NavBar() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false
    }}>
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="Maps" component={MapScreen}/>
      <Tab.Screen name="Post" component={PostScreen}/>
      <Tab.Screen name="Friends" component={FriendsScreen}/>

      <Tab.Screen name="Profile" component={ProfileScreen}/>
    </Tab.Navigator>
  );
}

export const NavigationRoutes = createNativeStackNavigator({
  initialRouteName: 'Login',
  screens: {
    Home: {
      screen: NavBar,
      options: { headerShown: false }

    },

    Signup: {
      screen: Signup,
      options: { headerShown: false }
    },
    Login: {
      screen: Login,
      options: { headerShown: false }
    }
  },
});

export const Navigation = createStaticNavigation(NavigationRoutes);
