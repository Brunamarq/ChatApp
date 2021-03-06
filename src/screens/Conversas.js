import React, { Component } from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
//import { connect } from 'react-redux';

import ConversasStack from './ConversasStack';
import ContatoList from './ContatoList';
import Config from './Config';


const ConversasNavigator = createBottomTabNavigator ({
    ConversasStack:{
        screen:ConversasStack,
        navigationOptions:{
            tabBarLabel:'Conversas',
            
            
        }
    },
    ContatoList:{
        screen: ContatoList
    },
    Config: {
        screen: Config
    }
}, {
    tabBarPosition: 'bottom',
    animationEnabled:false,
    swipeEnabled:false,
    
});



const AppContainer = createAppContainer (ConversasNavigator);
export default AppContainer;