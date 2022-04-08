import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity,Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import {heatmap_green_dark,heatmap_green_medium,heatmap_green_light,heatmap_green_extra_light,heatmap_no_color,heatmap_red_dark,heatmap_red_medium,heatmap_red_light,heatmap_red_extra_light,black_color,white_color} from "../../../AppColors";

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
  
  let fontColor = color === '#59FF59' || color === '#ACFFAC'?black_color : white_color;

  return (
    <TouchableOpacity onPress={() => onBlockPress({ value, index })} style={[styles.heatMapBlock, { flex:1,backgroundColor: color, width: size, height: 50 }, style]}>
      <View style={{flex:1,borderWidth:0}}>
        <View style={{flex:1,borderWidth:0,alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:11,fontFamily:'Montserrat-Regular',color:fontColor}}>{value.name}</Text>
        </View>
        <View style={{flex:1,borderWidth:0,alignItems:'center',justifyContent:"flex-start"}}>
          <Text style={{fontSize:12,fontFamily:'Montserrat-Regular',color:fontColor}}>{value.value}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const HeatMapColumn = ({ children }) => (
  <View style={[styles.heatMapColumn,{flex: 1,flexDirection: 'row',justifyContent: 'space-between',}]}>
    { children }
  </View>
);

const HeatMap = ({ numberOfLines, values, indexStart, colors,redcolors,colorsPercentage, maximumValue, blocksSize, onBlockPress, blocksStyle }) => {
  
  const [maxValue, setMaxValue] = useState(0);
  const [minValue, setMinValue] = useState(0);
  
  useEffect(() => {   
   setRelativeMaxMinValue();
  }, []);

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
       if(values[j])
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