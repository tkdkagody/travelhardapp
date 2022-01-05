import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, version } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { theme } from './color';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from '@expo/vector-icons'; 


//TouchableWithoutFeedback : 터치효과를 알리지 않아도 될 때. ui변화 노 : onPress, onPressIn, inPressOut 
//pressable 
//hitSlope : 터치범위 
//onChangeText : text값 받기 
//keyboardType 
//returnKeyType, returnKeyLable
//blurOnSubmit props  키보드 유지
//secureTextEntry  : 비밀번호 디스크
//multiline : 여러줄 엔터 
//onChangeText
// autoCorrect // autoCapitalize

//onSubmitEditing 

const STORAGE_KEY = "@toDos"

export default function App() {

  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});  //no arr yes obj  hashmap?
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    setTimeout(function() {
      loadToDos();
    }, 2000);
  },[])


  const work = () => setWorking(true);
  const travel = () => setWorking(false);

  const onChangeText = (payload) => {
    setText(payload);
  }

 

  const saveToDo = async (toSave) => {
    //toSave 는 addToDo 함수를 통ㅇ해 saveToDos에 전해짐 
    const s = JSON.stringify(toSave)
    await AsyncStorage.setItem(STORAGE_KEY , s)   //key와 value를 넣어줌 
  }

  const loadToDos = async () => {
    try{
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(s));
      setLoading(false);
    } catch(err){
      console.log(err);
    }
  }


  const addToDo = () => {
    if(text ==="") {
      return;
    }
    //save to do //git 확인해보기///////
    //react 는 상태 직접 수정 불가능함 ! 
    // const newToDos = Object.assign({}, toDos, { [Date.now()] : {text: text, work : working}});
    const newToDos = {
      ...toDos, 
      [Date.now()] : {text:text,working:working},
    }
    setToDos(newToDos);
    saveToDo(newToDos);
    setText("");
  }

  //console.log(toDos); // addToDo밖에 나와야 바로 콘솔 뜸 

  const deleteToDo = (id) =>{

  }

 

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work} >
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableHighlight 
        onPress={travel}
        underlayColor="red"
        activeOpacity={0.5}
        >
         <Text style={{...styles.btnText, color: !working ? "white" : theme.grey }}>Travel</Text>
        </TouchableHighlight>
      </View>
    
        <TextInput  
        onSubmitEditing={addToDo}
        value={text}
        // autoCapitalize={"save"}
        onChangeText={onChangeText}
        keyboardType="web-search"
        returnKeyType="send"
        placeholder={working ? "Add a to do" : "where do you want to go?"} style={styles.input}> 
        </TextInput>
        <ScrollView>
          {

            loading ?  <View><ActivityIndicator size="small" color="white" style={styles.loading}/></View>:
            Object.keys(toDos).map((key) => (
              toDos[key].working === working ? (<View style={styles.toDo} key={key}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={()=> deleteToDo(key)}>
                  <Fontisto  name="trash" size={18} color={theme.grey}></Fontisto>
                </TouchableOpacity>
              </View>): null
            ))
          }
        </ScrollView>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : theme.backgound,
    paddingHorizontal: 20,
  },
  header:{
    justifyContent : "space-between",
    flexDirection: "row",
    marginTop:100
  },
  btnText : {
    fontSize: 38,
    color: "white",
    fontWeight: "600",

  },
  input:{  //input p
    backgroundColor: "white",
    paddingVertical: 15, 
    paddingHorizontal: 20,
    borderRadius: 30,
    //marginTop: 20,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo:{
    backgroundColor: theme.toDoBG,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection :"row",
    alignItems :"center",
    justifyContent :"space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16, 
    fontWeight: "600",
  },
  loading : {
    marginTop:60,
  }
});






/*
=> Object.assign() 예시
const toDos = {};
undefined
toDos[Date.now()] = {work :false}
{work: false}
toDos
{1641314810648: {…}}
Object.assign({},toDos,{ [Date.now()] : "hello"});
{1641314810648: {…}, 1641314895175: 'hello'}
1641314810648: {work: false}
1641314895175: "hello"
[[Prototype]]: Object

*/