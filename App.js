import React, { Component } from 'react';
import { TouchableOpacity, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Amplify, { Storage } from 'aws-amplify';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);

import { withAuthenticator } from 'aws-amplify-react-native';

type Props = {};
class App extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      text: 'default',
    }
  }

  submit () {
    Storage.put(this.state.text + '.txt', 'Hello')
    .then (result => console.log(result))
    .catch(err => console.log(err));

  }

  render() {
    return (
      <View style={styles.container}>

        <Text style={styles.inputLabel}> text: </Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({ text: text })}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.submit()}
        >
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row'
  },
  input: {
    height: '10%',
    width: '90%',
    padding: '1%',
    margin: '1%',
    backgroundColor: 'skyblue'
  },
  passwordInput: {
    height: '10%',
    width: '90%',
    padding: '1%',
    margin: '1%',
    backgroundColor: 'steelblue'
  },
  button: {
    backgroundColor: 'green',
    padding: '1%',
    margin: '10%',
  },
  inputLabel: {
    padding: '1%',
    alignSelf: 'flex-start'
  },
  passwordInputLabel: {
    alignSelf: 'flex-start'
  }
});
export default withAuthenticator(App);