import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity,Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';

import {heatmap_green_dark,heatmap_green_medium,heatmap_green_light,heatmap_green_extra_light,heatmap_no_color,heatmap_red_dark,heatmap_red_medium,heatmap_red_light,heatmap_red_extra_light,black_color} from "../../../AppColors";

const { Popover } = renderers;

const HeatMapBlock = ({ size, value, index, colors,redcolors,colorsPercentage, maximumValue, minimumValue, onBlockPress, style }) => {

  let color;

  if(value.value >= 0)
  {
      const valuePercentage = value.value/maximumValue.value * 100;    

      for(let i = 0; i < colorsPercentage.length; i++) 
      {  
        if(valuePercentage >= colorsPercentage[i])    
          color = colors[i];    
        else      
          break;
      }
  }
  else
  {
      const valuePercentage = value.value/minimumValue.value * 100;

      for(let i = 0; i < colorsPercentage.length; i++) 
      {  
        if(valuePercentage >= colorsPercentage[i])    
          color = redcolors[i];    
        else      
          break;
      }
  }

  if(!color)
    return null;
  
  return (

      <Menu renderer={Popover} rendererProps={{ placement: 'top',anchorStyle: {marginRight:1,backgroundColor:color} }}>
        <MenuTrigger>
          <View onPress={() => onBlockPress({ value, index })} style={[styles.heatMapBlock, { backgroundColor: color, width: size, height: size }, style]}>
              <View style={{flex:1,borderWidth:0}}>
                <View style={{flex:1,borderWidth:0,alignItems:'center',justifyContent:'flex-end'}}>
                    <Text style={{fontSize:13,fontFamily:'Montserrat-Regular',color:black_color}}>
                      {value.name.length > 10 ? `${value.name.substring(0, 5)}...`:value.name}  
                    </Text>
                </View>
                <View style={{flex:1,borderWidth:0,alignItems:'center',justifyContent:"flex-start"}}>
                    <Text style={{fontSize:13,fontFamily:'Montserrat-Regular',color:black_color}}>{value.value}</Text>
                </View>
              </View>
          </View>
        </MenuTrigger>
        <MenuOptions optionsContainerStyle={{minWidth:150,borderRadius:7,height:60,alignItems:'center',justifyContent:'center',backgroundColor:color}}>    
            {/* <View style={{alignItems:'center',justifyContent:'center'}}>
              <Text>Hello World</Text>
            </View>                             */}
            <MenuOption style={{borderTopWidth:0,borderLeftWidth:0,borderRightWidth:0,borderBottomWidth:0}}>
                <View style={{borderWidth:0,padding:3,minWidth:130,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:13,fontFamily:'Montserrat-SemiBold',color:black_color}}>{value.name}</Text>
                </View>
                <View style={{borderWidth:0,padding:3,minWidth:130,alignItems:'center',justifyContent:'center'}}>
                  <Text style={{fontSize:13,fontFamily:'Montserrat-Regular',color:black_color}}>{value.value}</Text>
                </View>                                
            </MenuOption>
        </MenuOptions>
      </Menu>

    // <TouchableOpacity onPress={() => onBlockPress({ value, index })} style={[styles.heatMapBlock, { backgroundColor: color, width: size, height: size }, style]}>
    //   <View style={{flex:1,borderWidth:0}}>
    //     <View style={{flex:1,borderWidth:0,alignItems:'center',justifyContent:'flex-end'}}>
    //       <Text style={{fontSize:13,fontFamily:'Montserrat-Regular'}}>
    //           {value.name.length > 10 ? `${value.name.substring(0, 5)}...`:value.name}  
    //       </Text>
    //     </View>
    //     <View style={{flex:1,borderWidth:0,alignItems:'center',justifyContent:"flex-start"}}>
    //       <Text style={{fontSize:13,fontFamily:'Montserrat-Regular'}}>{value.value}</Text>
    //     </View>
    //   </View>
    // </TouchableOpacity>
  );
}

const HeatMapColumn = ({ children }) => (
  <View style={[styles.heatMapColumn,{flexDirection:'row'}]}>
    { children }
  </View>
);

const HeatMap = ({ numberOfLines, values, indexStart, colors,redcolors,colorsPercentage, maximumValue, blocksSize, onBlockPress, blocksStyle }) => {
  // const [maxValue, setMaxValue] = useState(maximumValue);
  // const [minValue, setMinValue] = useState(maximumValue);

  const [maxValue, setMaxValue] = useState(0);
  const [minValue, setMinValue] = useState(0);
  
  useEffect(() => {
   // setRelativeMaxValue();
   //setRelativeMinValue();
   setRelativeMaxMinValue();

  }, []);

  // const setRelativeMaxValue = () => {

  //   if(maxValue !== 'relative') return;
  //   let max = 1;

  //   for(let i = 0; i < values.length; i++) {

  //     if(values[i] >= 0)
  //     {
  //       if(values[i] > max)
  //         max = values[i];
  //     }      
  //   }

  //   setMaxValue(max);
  // }

  // const setRelativeMinValue = () => {

  //   if(minValue !== 'relative') return;
  //   let min = -1;

  //   for(let i = 0; i < values.length; i++) {

  //     if(values[i] < 0)
  //     {
  //       if(values[i] < min)
  //         min = values[i];
  //     }      
  //   }

  //   setMinValue(min);
  // }


  const setRelativeMaxMinValue = () => {

    let postiveArray  = [];
    let negativeArray = [];

    for(let i = 0; i < values.length; i++) 
    {         
        if(values[i].value >= 0)
        {
            postiveArray.push(values[i]);
        }
        else
        {
            negativeArray.push(values[i]);
        }    
    }

    postiveArray = postiveArray.sort((a,b)=>{
      return a.value-b.value;
    })

    negativeArray = negativeArray.sort((a,b)=>{
      return b.value-a.value;
    })        

    let maxValue = postiveArray[postiveArray.length-1];
    let minValue = negativeArray[negativeArray.length-1];

    setMaxValue(maxValue);
    setMinValue(minValue)    
  }


  const generateBlocks = atualBlock => {
    const blocks = [];
    for(let j = 0; j < numberOfLines; j++)
    {
       if(values[j + atualBlock])
       {
          blocks.push(<HeatMapBlock key={Math.random()} style={blocksStyle} size={blocksSize} index={j + atualBlock + indexStart} value={values[j + atualBlock]} colors={colors} redcolors={redcolors} colorsPercentage={colorsPercentage} onBlockPress={onBlockPress} maximumValue={maxValue} minimumValue={minValue} />);
       }    
    }    
    return blocks;   
  }

  const generateColumns = () => {
    const numberOfColumns = values.length/numberOfLines;
    const columns = [];
    let atualBlock = 0;

    for(let i = 0; i < numberOfColumns; i++) {      
      columns.push(
      <HeatMapColumn key={Math.random()}>
        { generateBlocks(atualBlock) }
      </HeatMapColumn>);
      atualBlock += numberOfLines;
    }

    return columns;
  }

  return (
    <ScrollView /*horizontal={true}*/>
      { generateColumns() }
    </ScrollView>
  );
};

HeatMap.propTypes = {
  numberOfLines: PropTypes.number,
  values: PropTypes.array,
  colors: PropTypes.array,
  redcolors: PropTypes.array,
  colorsPercentage: PropTypes.array,
  maximumValue: PropTypes.string,
  blocksSize: PropTypes.number,
  // Optionals
  indexStart: PropTypes.number,
  onBlockPress: PropTypes.func,
  blocksStyle: PropTypes.object
};
  
HeatMap.defaultProps = {
  numberOfLines: 7,
  values: [],
  colors: [heatmap_no_color, heatmap_green_extra_light, heatmap_green_light, heatmap_green_medium, heatmap_green_dark],
  redcolors : [heatmap_no_color,heatmap_red_extra_light,heatmap_red_light,heatmap_red_medium,heatmap_red_dark],
  colorsPercentage: [0, 0.00001, 41, 60, 80],
  maximumValue: 'relative',
  blocksSize: 30,
  // Optionals
  indexStart: 0,
  onBlockPress: () => {},
  blocksStyle: {}
};

export default HeatMap;