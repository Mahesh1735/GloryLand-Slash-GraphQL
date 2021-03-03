import React, { useState, useEffect, useContext}from 'react';
import PropTypes from 'prop-types'
import { TextInput, View, StyleSheet, SafeAreaView, Image } from 'react-native'
import colors from "../config/colors";
import Appbutton from "../components/Appbutton"
import AppTextInput from "../components/AppTextInput"
import { useQuery, useMutation, gql, useLazyQuery } from "@apollo/client";
import { and } from 'react-native-reanimated';
import AuthContext from '../auth/context';

const Login = ( {navigation} ) => {

    const [pno, setpno] = useState("");
    const authContext = useContext(AuthContext);


    const QUERY_USER = gql`query QueryUser($eq: String = "") {
        queryUser(filter: {phone_no: {eq: $eq}}) {
          id
          first_name
          last_name
          phone_no
          email
        }
      }`;

    const [getUser, { loading, data }] = useLazyQuery(QUERY_USER);


    if (loading){
        return (
            <SafeAreaView style={styles.background}>
            <Image style={styles.logo} source={require("../assets/name.jpg")}/>
            <Appbutton title='Loading...' color ='secondary' />
            </SafeAreaView>
        )
    };

    if(typeof(data) !== 'undefined'){
        if (typeof(data.queryUser[0]) !== 'undefined') {
            authContext.setUser(data.queryUser[0]);
            navigation.navigate("Explore");
        } else {
            alert("User Not found! Please Register");
            navigation.navigate("Register");
        }
    };
    

    return (
        <SafeAreaView style={styles.background}>
            <Image style={styles.logo} source={require("../assets/name.jpg")}/>
            <AppTextInput placeholder='Phone Number' onChangeText={text => setpno(text)} />
            <Appbutton title='LogIn' color ='secondary' onPress = {() => {
                getUser({ variables: { eq: pno } });
                
            // navigation.navigate("Explore");
            }}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width : "60%",
      position: 'relative',
      top : 10,
      resizeMode : 'contain',
    },
  });

export default Login
