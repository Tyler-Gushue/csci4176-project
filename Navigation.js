import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';

import { HomeScreen } from './screens/Home.js'
import { ProfileScreen } from './screens/Profile.js'
import { Login } from './screens/Login.js'
import { Signup } from './screens/Signup.js'


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();

export function NavBar() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen}/>
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
    },
    Login: {
      screen: Login,
    }
  },
});

export const Navigation = createStaticNavigation(NavigationRoutes);
