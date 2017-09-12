import { Notifications } from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/Login/LoginScreen';
import MapPhotoTagScreen from '../screens/Map/MapPhotoTagScreen';
import SplashScreen from '../screens/SplashScreen';
import SignupScreen from '../screens//Login/SignupScreen';
import electedOfficials from '../screens/elected_official';
import SolverScreen from '../screens/User/SolverScreen';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';
import { connect } from 'react-redux';
import * as Actions from '../actions';
// RootNavigation actually uses a StackNavigator but the StackNavigator in turn loads a TabNavigator
const mapStateToProps = (state, ownProps) => {
  return {
    badges: state.badges,
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateBadge: badges => {
      dispatch(Actions.setBadge(badges));
    },
  };
};
const RootStackNavigator = StackNavigator(
  {
    SplashScreen: {
      screen: SplashScreen,
      navigationOptions: {
        header: false,
      },
    },
    Login: {
      screen: LoginScreen,
    },
    Main: {
      screen: MainTabNavigator,
    },
    PhototagFromMap: {
      screen: MapPhotoTagScreen,
    },
    Signup: {
      screen: SignupScreen,
    },
    electedOfficials: {
      screen: electedOfficials,
    },
    SolverScreen: {
      screen: SolverScreen,
    },
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  }
);

class RootNavigator extends React.Component {
  static navigationOptions = {
    title: 'SplashScreen',
  };
  componentWillMount() {
    this._registerForPushNotifications();
  }
  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    return <RootStackNavigator screenProps={{ badges: this.props.badges }} />;
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({ origin, data }) => {
    console.log('type', typeof this.props.badges);
    console.log(`Push notification ${origin} with data: ${JSON.stringify(data)}`);
    this.props.updateBadge(this.props.badges + 1);
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RootNavigator);
