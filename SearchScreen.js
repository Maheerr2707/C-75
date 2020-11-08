import React from 'react';
import { Text, View, ScrollView, FlatList } from 'react-native';
import { FlatList, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import db from '../config'

export default class Searchscreen extends React.Component {
  constructor(){
    super()
    this.state = {AllTransactions:[],lastVisibleTransaction:null, search:""}
  }
  componentDidMount= async()=>{
const query = await db.collection("tranaction").limit(10).get()
query.docs.map((doc)=>{this.setState({AllTransactions:[...this.state.AllTransactions,doc.data()],
lastVisibleTransaction:doc
})})
  }

fetchMoreTransactions= async()=>{
const query=await db.collection("tranaction").startAfter(this.state.lastVisibleTransaction).limit(10).get()
query.doc.map((doc)=>{this.setState({AllTransactions:[...this.state.AllTransactions,doc.data()],
lastVisibleTransaction:doc
})})
}

    render() {
      return (
  /*  <ScrollView>
    {this.state.AllTransactions.map((transaction,index)=>{
      return(<View key={index} style={{borderBottomWidth:2}}>
<Text>{transaction.typeOfTransaction}</Text>
      </View>)
    })} 
    
          </ScrollView>*/
          <View style={styles.container}>
     <View style={styles.searchBar}>
     <TextInput
   style={styles.bar}
   placeholder="EnterBookID or EnterStudentID"
   onchangeText={(text)=>{
     this.setState({search:text})
   }}  
     />  
<TouchableOpacity style={styles.searchButton} onPress={()=>{
this.searchTransaction(this.state.search)
}}>
  <Text>Search</Text>
     </TouchableOpacity>


       </View>       
  <FlatList>
  data={this.state.AllTransactions}  
  renderItem={({item})=>(
    <View style={{borderBottomWidth:2}}>
<Text>{"bookIdD"+item.bookId}</Text>
  <Text>{"StudentID"+item.studentId}</Text>
  <Text>{"TransactionType"+item.typeOfTransaction}</Text>
  <text>{"Date"+item.dateOfTransaction.toDate()}</text>
    </View>
  )}
keyExtractor={(item,index)=>index.toString()}
onEndReach={this.fetchMoreTransactions}\
onEndReachedThreshold={0.7}  
  </FlatList> 
  </View>       
      )
    }
  }

  const styles = StyleSheet.create({ 
    container: { flex: 1, marginTop: 20 },
      searchBar:{ flexDirection:'row',
       height:40,
       width:'auto',
       borderWidth:0.5,
       alignItems:'center',
       backgroundColor:'grey',
 }, 
 bar:{ borderWidth:2, 
     height:30,
     width:300,
     paddingLeft:10,
 },
    searchButton:{ borderWidth:1,
    height:30,
    width:50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'green'
           } })