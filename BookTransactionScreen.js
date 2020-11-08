import React from 'react';
import {Text,View,TouchableOpacity,StyleSheet,Image,Alert,KeyboardAvoidingView,ToastAndroid} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { TextInput } from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import db from '../config.js';

export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        scannedData: '',
        buttonState: 'normal',
        scannedBookID: '',
        scannedStudentID:'',
        transactionmessage:''
      }
    }

    getCameraPermissions = async (ID) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: 'ID',
        scanned: false
      });
    }

    handleBarCodeScanned = async({type, data})=>{
      this.setState({
        scanned: true,
        scannedData: data,
        buttonState: 'normal'
      });
    }
handletransactions=()=>{
  var transactionmessage
  db.collection("books").doc(this.state.scannedBookID).get()
  .then((doc)=>{
console.log(doc.data)
     var book = doc.data()
       if(book.bookAvailability){
         this.initiatebookissue()
         transactionmessage = "book issued"
         ToastAndroid.show(transactionmessage,ToastAndroid.SHORT)      
       }
     else {
       this.initiatebookreturn()
    transactionmessage = "book returned"
    ToastAndroid.show(transactionmessage,ToastAndroid.SHORT)
      }
  })
     this.setState({
       transactionmessage:transactionmessage
     })
}

initiatebookissue=async ()=>{
  db.collection("tranaction").add({
    studentId:this.state.scannedStudentID,
    bookId:this.state.scannedBookID,
    dateOfTransaction:firebase.firestore.Timestamp.now().toDate(),
    typeOfTransaction:"issue"
  })
  db.collection("books").doc(this.state.scannedBookID).update({
    bookAvailability:false
  })
 db.collection("students").doc(this.state.scannedStudentID).update({
  numberOfBooksIssued:firebase.firestore.FieldValue.increment(1)
 }) 
     Alert.alert("booksissued")
     this.setState({
       scannedBookID:"",scannedStudentID:""
     })
}

initiatebookreturn=async ()=>{
  db.collection("tranaction").add({
    studentId:this.state.scannedStudentID,
    bookId:this.state.scannedBookID,
    dateOfTransaction:firebase.firestore.Timestamp.now().toDate(),
    typeOfTransaction:"return"
  })
  db.collection("books").doc(this.state.scannedBookID).update({
    bookAvailability:true
  })
 db.collection("students").doc(this.state.scannedStudentID).update({
  numberOfBooksIssued:firebase.firestore.FieldValue.increment(-1)
 }) 
     Alert.alert("booksreturned")
     this.setState({
       scannedBookID:"",scannedStudentID:""
     })
}
    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <KeyboardAvoidingView style={Styles.container} behaviour="padding" enable>
            <View>
              <Image 
            source={require("../assets/booklogo.jpg")}
            style={{
              width:200,
              height:200
            }}  
              />
        <Text style={{textAlign:"center", fontSize:30}}>
          WIRELESS LIBRARY
          </Text>      
            </View>
    <View style={Styles.inputView}>
    <TextInput style={Styles.InputBox}
     placeholder="EnterBookID"
     onChangeText={text=> this.setState({scannedBookID:text})}
     value={this.state.scannedBookID}/>
      <TouchableOpacity style={Styles.scanButton}
    onPress={()=>{
      this.getCameraPermissions("BookID")
    }}>
        <Text style={Styles.buttonText}> scan </Text>
</TouchableOpacity>
    </View>
    
    <View style={Styles.inputView}>
    <TextInput style={Styles.InputBox} 
    placeholder="EnterStudentID"
   onChangeText={text=> this.setState({scannedStudentID:text})}
   value={this.state.scannedStudentID}/>
      <TouchableOpacity style={Styles.scanButton}
      onPress={()=>{
        this.getCameraPermissions("StudentID")
      }}>
        <Text style={Styles.buttonText}> Scan </Text>
</TouchableOpacity>
    </View>
       <TouchableOpacity style={Styles.submitbutton} 
       onPress={async()=>{
        var transactionmessage=this.handletransactions()
       this.setState({
         scannedBookID:"", scannedStudentID:""
       }) 
        }}>
     <Text style={Styles.submitbutton}>Submit</Text>
  </TouchableOpacity>
        </KeyboardAvoidingView>
        );
      }
    }
  }

  const Styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 20,
    },
    inputView:{
      flexDirection: "row",
      margin: 20
    },
    InputBox: {
      width:200,
      height:40,
      borderWidth:1.50,
      borderRightWidth:0,
      fontSize:20
    }, 
    submitbutton:{
       backgroundColor:"black",
       width:100,
       height:50
    },   
       submitbuttontext:{
         padding:30,
         textAlign:'center',
         textSize:30,
         fontWeight:'bold',
         color:"white" 
       }
  });