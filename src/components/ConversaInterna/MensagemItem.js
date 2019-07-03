import React, { Component } from 'react';
import {View, Text, StyleSheet } from 'react-native';



export default class MensagemItem extends Component {

    constructor(props) {
        super(props);

        let bgColor = '#fff8dc';
        let align = 'flex-start';
        let txtAlign = 'left';

        if(this.props.data.uid == this.props.me) {
            bgColor = '#afeeee';
            align = 'flex-end';
            txtAlign = 'right';
        }
        
        this.state = {
            bgColor:bgColor,
            align:align,
            txtAlign:txtAlign,
            dateMsg:this.getFormattedDate( this.props.data.date)
        };

    }

    getFormattedDate(originalDate) {
        let cDate = new Date();
        let mDate = originalDate.split(' ');
        let todayDate = cDate.getFullYear()+'-'+(cDate.getMonth()+1)+'-'+cDate.getDate();

        let newDate = mDate[1].split(':');
        newDate = ((newDate[0]<10)?'0'+newDate[0]:newDate[0])+':'+((newDate[1]<10)?'0'+newDate[1]:newDate[1]);

        if(todayDate != mDate[0]) {
            let newDateDays = mDate[0].split('-');

            newDate = newDatedays[2]+'/'+newDateDays[1]+'/'+newDateDays[0]+' '+newDate;
        }
        return newDate;

    }

    render() {
        return (
          <View style={[MensagemItemStyles.area, {alignSelf:this.state.align, backgroundColor:this.state.bgColor}]}>
                {this.props.data.msgType == 'text' && 
                    <Text style={{textAlign:this.state.txtAlign}}>{this.props.data.m}</Text>
                }
                {this.props.data.msgType == 'image' &&
                    <Text>(IMAGEM)</Text>
                }

              <Text style={MensagemItemStyles.dateTxt}>{this.state.dateMsg}</Text>
          </View>
        );
    }
}

const MensagemItemStyles = StyleSheet.create({
 area:{
     marginLeft:10,
     marginRight:10,
     marginTop:5,
     marginBottom:5,
     borderRadius:10,
     padding:10,
     maxWidth:'80%'
    },
    dateTxt:{
        fontSize:11,
        textAlign:'right'
    }
});