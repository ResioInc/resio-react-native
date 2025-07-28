import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '@/screens/auth/LoginScreen';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: { email?: string };
  ResetPassword: { token: string };
  Verification: { email: string; isSignup: boolean };
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* TODO: Add other screens */}
      {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
      {/* <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} /> */}
      {/* <Stack.Screen name="Verification" component={VerificationScreen} /> */}
    </Stack.Navigator>
  );
}; 