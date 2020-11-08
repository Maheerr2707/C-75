import React from 'react';
import {Text,View,TouchableOpacity,StyleSheet,Image,Alert,KeyboardAvoidingView,ToastAndroid} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
export default class Loginscreen extends React.Component {
   constructor(){
       super()
       this.state={EmailId:"",password:""}
   }

login= async(EmailId,password)=>{
    if(EmailId && password){
        try {
    const response = await firebase.auth().signInWithEmailAndPassword(EmailId,password) 
    if(response){this.props.navigation.navigate('Transaction')}     
        } catch (error) {
    switch(error.code){
        case "auth/user-not-found": Alert.alert("User doesn't Exist")
        break;
        case "auth/invalid-email": Alert.allert("Incorrect Email or Password")
    }        
        }
    }
  else{
    Alert.alert("Enter EmailId or Password") 
  }  
}   

    render(){
        return(
        <KeyboardAvoidingView>
            <View>
                <Image style = {{height:200, width:200}}
                source={require("../assets/booklogo.jpg")}/>
            <Text style = {{textAlign:'center', fontSize:30}}>WirelessLibrary</Text>
                </View>

<View>
    <TextInput style = {styles.loginBox}
    placeHolder="Enter your E-mail"
    keyboardType="email-address"
    onchangeText={(text)=>{
        this.setState({EmailId:text})
    }}
  />

    <TextInput style = {styles.loginBox}
    secureTextEntry={true}
    placeHolder="Enter your password"
    onchangeText={(text)=>{
        this.setState({password:text})
    }}
  />

</View>

<View>
    <TouchableOpacity style={StyleSheet.button} 
    onPress={()=>{
        this.login(this.state.EmailId, this.state.password)
    }}   
    >
<Text style={{textAlign:'center'}}>
login
</Text>
    </TouchableOpacity>
</View>

        </KeyboardAvoidingView>)
    }
}
const styles = StyleSheet.create({
     loginBox: {
     width: 300,
     height: 40,
     borderWidth: 1.5,
     fontSize: 20,
     margin:10,
     paddingLeft:10 
  },
  button:{
      height:30,
      width:90,
      borderWidth:1,
      marginTop:20,
      paddingTop:5,
      borderRadius:7
    }
})
