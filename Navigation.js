import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';

import { HomeScreen } from './screens/Home.js'
import { PostScreen } from './screens/Post.js'
import { ProfileScreen } from './screens/Profile.js'
import { FriendsScreen } from './screens/Friends.js'
import { MapScreen } from './screens/Map.js'
import { Login } from './screens/Login.js'
import { Signup } from './screens/Signup.js'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PostDetailsScreen } from './screens/PostDetails.js';
import { MyPostsScreen } from './screens/MyPosts.js';


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();

export function NavBar() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#b4dafb',
      tabBarStyle: {
        backgroundColor: '#67beff',
        borderColor: '#67beff'
      }
    }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-box" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" size={size} color={color} />
          )
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          )
        }}
      />
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
    },

    Map: {
      screen: MapScreen,
      options: { headerShown: false }
    },

    PostDetails:{
      screen: PostDetailsScreen,
      options: { headerShown: false}
    },

    MyPosts:{
      screen: MyPostsScreen,
      options: { headerShown: false}
    }
  },
});

export const Navigation = createStaticNavigation(NavigationRoutes);
