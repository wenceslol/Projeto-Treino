import * as React from "react";
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './components/screens/RootStack';


function App() {

  return (
    <NavigationContainer>
      <RootStack></RootStack>
    </NavigationContainer>
  );
}

export default App;
