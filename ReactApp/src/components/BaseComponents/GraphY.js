import React, { useEffect, useState, useRef, useReducer } from 'react'
import DataConnection from '../SystemComponents/DataConnection';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import ContextMenu from '../SystemComponents/ContextMenu';
import PV from '../SystemComponents/PV'
import Plot from 'react-plotly.js';
import { isMobile } from 'react-device-detect';
import debounce from "lodash.debounce";
import { replaceMacros } from '../SystemComponents/Utils/macroReplacement';
import { ContinuousColorLegend } from 'react-vis';
import { forEach } from 'mathjs';
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  buttonRoot: {
    textTransform: 'none',
  },
  accordianRoot: {
    '&:before': {
      background: 'rgba(0,0,0,0)',
    }
  },
  '@global': {
    '.js-plotly-plot .plotly .modebar': {
      // left: '50%',
      transform: 'translateX(-50%)',
    }
  },
}));


/**
* The GraphY Component is a wrapper on Uber's React-Vis FlexibleXYPlot lineSeries graph component. The GraphY component is implemented with zero margins and enabled to grow to the width and height of its parent container.<br/><br/>
* The width and height must be controlled from the parent component.<br/><br/>
* React-vis Demos:
* https://uber.github.io/react-vis/examples/showcases/plots<br/><br/>
* React-vis API:
* http://uber.github.io/react-vis/documentation/series-reference/line-series

*/
// class GraphY extends React.Component {
//   constructor(props) {
//     super(props);
//     let state={}
//     let pv;
//     let pvname;
//     let pvnames=[];
//     let pvs={};
//     for (pv in this.props.pvs){
//       pvname=this.props.pvs[pv];
//       if (typeof this.props.macros !== 'undefined'){

//         let macro;
//         for (macro in this.props.macros){
//           pvname=pvname.replace(macro.toString(),this.props.macros[macro].toString());
//         }
//       }
//       //    console.log(pvname)

//       pvs[pvname]={label:"", initialized: false,pvname:pvname,value:[],lastValue:"",timestamp:[],char_value:"",alarmColor:"",lower_disp_limit: 0,upper_disp_limit: 10000,lower_warning_limit: 4000,upper_warning_limit: 6000,
//       units: "V",precision: 0, ymin:1000000000000000000,ymax:-1000000000000000000 };
//       pvnames.push(pvname);
//     }
//     state['pvnames']=pvnames;
//     state['pvs']=pvs;
//     //  state['ymin']=1000000000000000000;
//     //  state['ymax']=-1000000000000000000;
//     state['PollingTimerEnabled']=false;
//     state['openContextMenu']= false;
//     state['x0']=0;
//     state['y0']=0;
//     const contextPVs=[];
//     for (const item in pvs){
//       contextPVs.push(pvs[item]);
//     }
//     state['contextPVs']=contextPVs;

//     this.state=state;






//     this.handleInputValue= this.handleInputValue.bind(this);
//     this.handleInputValuePolled= this.handleInputValuePolled.bind(this);
//     this.handleInputValueUnpolled= this.handleInputValueUnpolled.bind(this);
//     this.handleInputValueLabel= this.handleInputValueLabel.bind(this);
//     this.handleMetadata= this.handleMetadata.bind(this);
//     this.multipleDataConnections=this.multipleDataConnections.bind(this);
//     this.handleToggleContextMenu=this.handleToggleContextMenu.bind(this);
//     this.multipleLineData=this.multipleLineData.bind(this);
//     this.calcTimeFormat=this.calcTimeFormat.bind(this);
//   }
//   calcTimeFormat=(timestamp)=> {
//     let mydate = new Date(timestamp * 1000);
//     //  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
//     //  let year = mydate.getFullYear();
//     // let month = months[mydate.getMonth()];
//     //let date = mydate.getDate();
//     let hour = mydate.getHours();
//     let min = mydate.getMinutes();
//     let sec = mydate.getSeconds();
//     //let ms = mydate.getMilliseconds()
//     //let value= hour + ':' + min + ':' + sec +':' + ms;
//     let value;
//     if( min<10){
//       min='0'+min;

//     }

//     if( sec<10){
//       sec='0'+sec;

//     }
//     value=hour + ':' + min + ':' + sec ;

//     return value;
//   }

//   handleInputValue = (inputValue,pvname,initialized,severity,timestamp)=>{

//     if(this.props.usePolling){
//       let pvs=this.state.pvs;
//       pvs[pvname].initialized=initialized;
//       pvs[pvname].lastValue=inputValue;
//       pvs[pvname].severity=severity;
//       this.setState({pvs:pvs});
//     }
//     else{
//       let pvs=this.state.pvs;
//       pvs[pvname].initialized=initialized;
//       this.setState({pvs:pvs});
//       this.handleInputValueUnpolled(inputValue,pvname,initialized,severity,timestamp);
//     }


//     //  console.log("value: ",inputValue);
//     //  console.log("pvname:", pvname);
//   }



//   handleInputValuePolled = ()=>{
//     let pv;
//     let d = new Date();
//     let timestamp=d.getTime()/1000;

//     for(pv in this.state.pvnames){

//       if(this.state.pvs[this.state.pvnames[pv]].initialized){

//         //    console.log(timestamp,this.state.pvnames[pv],this.state.pvs[this.state.pvnames[pv]].lastValue);
//         this.handleInputValueUnpolled(this.state.pvs[this.state.pvnames[pv]].lastValue,this.state.pvnames[pv],this.state.pvs[this.state.pvnames[pv]].initialized,this.state.pvs[this.state.pvnames[pv]].severity,timestamp)
//       }
//     }
//     //  console.log("value: ",inputValue);
//     //  console.log("pvname:", pvname);
//   }
//   handleInputValueUnpolled = (inputValue,pvname,initialized,severity,timestamp)=>{
//     //console.log("unpolled");
//     //  console.log("test");
//     //  console.log("value: ",inputValue);
//     //  console.log("pvname:", pvname);
//     let pvs=this.state.pvs;
//     let yDataArray=[];
//     let yTimeStampArray=[];
//     //let ymax=parseFloat(this.state.ymax);
//     //  let ymin=parseFloat(this.state.ymin);
//     //  console.log('ymax init',this.state.ymax)
//     // console.log('ymin init',this.state.ymin)

//     //  console.log('pvs[pvname].value', pvs[pvname].value);
//     //   console.log('inputValue', inputValue);
//     let max;
//     if (initialized===true){
//       if (typeof this.props.maxLength !== 'undefined'){
//         max=this.props.maxLength;
//         if (Array.isArray(inputValue)===false){
//           //  console.log("not array")
//           if ((typeof this.props.triggerOnSingleValueChange !== 'undefined')){
//             if (pvs[pvname].value.length>0){
//               if(inputValue!=pvs[pvname].value[pvs[pvname].value.length-1]){
//                 yDataArray=pvs[pvname].value.concat(inputValue);
//                 yTimeStampArray=pvs[pvname].timestamp.concat(timestamp);
//               }
//               else{
//                 yDataArray=pvs[pvname].value;
//                 yTimeStampArray=pvs[pvname].timestamp;
//               }
//             }
//             else {
//               yDataArray=[inputValue];
//               yTimeStampArray=[timestamp];
//             }

//           }
//           else {
//             //  console.log(pvname,timestamp)
//             if (pvs[pvname].value.length>0){
//               yDataArray=pvs[pvname].value.concat(inputValue);
//               yTimeStampArray=pvs[pvname].timestamp.concat(timestamp);
//             }
//             else{
//               yDataArray=[inputValue];
//               yTimeStampArray=[timestamp];
//             }

//           }
//         }
//         else{
//           if (pvs[pvname].value.length>0){
//             yDataArray=pvs[pvname].value.concat(inputValue);
//           }
//           else{
//             yDataArray=inputValue;
//           }
//         }
//       }
//       else {
//         yDataArray=inputValue;
//         max=inputValue.length;
//       }




//       //  console.log('yDataArray=pvs[pvname].value.concat(inputValue);', yDataArray);
//       pvs[pvname].initialized=initialized;
//       pvs[pvname].severity=severity;

//       let length= yDataArray.length;

//       if  (length> max){
//         yDataArray=yDataArray.slice(length-max);
//         if (this.props.useTimeStamp){
//           yTimeStampArray=yTimeStampArray.slice(length-max);

//         }
//       }
//       //    console.log('yDataArray=yDataArray.slice(length-max);', yDataArray);

//       let i=0;
//       let sample;
//       let data=[];
//       let n;
//       //	console.log("pv.value: ",this.state[this.props.pv].value);
//       let ymax=-1000000000000000000;
//       let ymin=1000000000000000000;

//       for(n in yDataArray){
//         let val;
//         if (this.props.yScaleLog10===true){
//           val=Math.log10(parseFloat(yDataArray[n]))
//         }
//         else{
//           val=yDataArray[n];
//         }
//         // console.log("value: ",this.state[this.props.pv].value[i]);
//         //console.log('n: ',n,' this.state.ymax: ',this.state.ymax,)
//         if(parseFloat(val)>ymax){



//           ymax=parseFloat(val);
//           //console.log('new Ymax',ymax)
//         }
//         if(parseFloat(val)<ymin){
//           ymin=parseFloat(val);
//         }


//         if (this.props.useTimeStamp){
//           sample={x:yTimeStampArray[n],y:val}
//         }
//         else{
//           sample={x:i,y:val}
//         }
//         // console.log("sample: ",sample)

//         data[i]=sample;
//         i++;

//       }


//       pvs[pvname].value=yDataArray;
//       pvs[pvname].timestamp=yTimeStampArray;
//       pvs[pvname].linedata=data;
//       pvs[pvname].ymin=ymin;
//       pvs[pvname].ymax=ymax;
//       //console.log('pvs[pvname].linedata', pvs[pvname].linedata);
//       //console.log('yTimeStampArray',yTimeStampArray)
//       //  console.log('length3', pvs[pvname].linedata.length);



//       /*  if ((typeof this.props.ymax) !=='undefined'){
//       ymax=this.props.ymax;

//     }

//     if ((typeof this.props.ymin)!=='undefined'){
//     ymin=this.props.ymin;

//   }
//   */
//   //   console.log('ymax end',ymax)
//   //   console.log('ymin end',ymin)

//   this.setState({pvs:pvs});//,ymax:ymax,ymin:ymin});


//   //state.pvs[pvname].inputValue=inputValue;
//   //pvData.pvs[pvname].initialized=initialized;
//   //pvData.pvs[pvname].severity=severity;

//   //console.log("pvData:",pvData)

//   //this.setState(pvData);
// }
// }


// handleMetadata =  pvname=>(metadata) =>{

//   let pvs=this.state.pvs;
//   pvs[pvname].metadata=metadata;
//   this.setState({pvs:pvs});
//   //  console.log("metadata",metadata)

// }



// handleInputValueLabel=pvname=>(inputValue)=>{

//   let pvs=this.state.pvs;
//   pvs[pvname].label=inputValue;
//   this.setState({pvs:pvs});

// }



// componentDidMount() {
//   if (this.props.usePolling){
//     let intervalId = setInterval(this.handleInputValuePolled, this.props.pollingRate);
//     // store intervalId in the state so it can be accessed later:
//     this.setState({'intervalId': intervalId});
//   }
// }


// componentWillUnmount() {
//   if (this.props.usePolling){
//     clearInterval(this.state.intervalId);
//   }
// }













// multipleDataConnections = () => {
//   //this.test("test1");
//   //this.handleInputValue();
//   let pv;
//   let DataConnections=[];
//   for (pv in this.state.pvs){
//     //console.log("linedata: ", this.state.pvs[pv].linedata);
//     DataConnections.push(
//       <div key= {pv.toString()}>
//         <DataConnection
//           pv={this.state.pvs[pv].pvname}
//           handleInputValue={this.handleInputValue}
//           handleMetadata={this.handleMetadata(this.state.pvs[pv].pvname)}
//           handleInputValueLabel={this.handleInputValueLabel(this.state.pvs[pv].pvname)}
//           usePvLabel={this.props.usePvLabel}
//           debug={this.props.debug}
//         />

//         {this.props.usePvLabel===true?this.state.pvs[pv].label+': ':""}
//         {/*this.state.pvs[pv].value*/}
//       </div>
//     )
//   }
//   //console.log(DataConnections[0]);
//   return DataConnections;
// }

// multipleLineData = () => {
//   //this.test("test1");
//   //this.handleInputValue();
//   let pv;
//   let lines=[];
//   let i=0;
//   let lineColor;
//   let theme=this.props.theme;
//   //    console.log(theme);
//   for (pv in this.state.pvs){
//     if(typeof this.props.lineColor !=='undefined'){
//       lineColor=this.props.lineColor;
//     }
//     else{

//         lineColor=theme.palette.reactVis.lineColors;



//     }
//     //console.log("linedata: ", this.state.pvs[pv].linedata);
//     if (this.state.pvs[pv].initialized===true){
//       lines.push(

//         <LineSeries

//           key={pv.toString()}
//           color={lineColor[i]}

//           data={this.state.pvs[this.state.pvs[pv].pvname].linedata}
//           style={{
//             strokeLinejoin: 'round',
//             strokeWidth: 2

//           }}
//         />

//       )
//     }
//     else{
//       //const data=this.state.pvs[this.state.pvs[pv].pvname].linedata;
//       const sample={x:0,y:0}
//       const data=[];
//       data[0]=sample;
//       //console.log(data)
//       lines.push(

//         <LineSeries

//           key={pv.toString()}
//           color={'grey'}

//           data={typeof this.state.pvs[this.state.pvs[pv].pvname].linedata==='undefined'?data:this.state.pvs[this.state.pvs[pv].pvname].linedata}
//           style={{
//             strokeLinejoin: 'round',
//             strokeWidth: 2

//           }}
//         />

//       )

//     }

//     i++;
//   }
//   //console.log(DataConnections[0]);
//   return lines;
// }

// handleContextMenuClose = event => {


//   this.setState({ openContextMenu: false });
// };

// handleToggleContextMenu = (event) => {
//   console.log(event.type)

//   event.persist()
//   this.setState(state => ({ openContextMenu: !state.openContextMenu,x0:event.pageX,y0:event.pageY }));

//   event.preventDefault();
// }



// render() {
//   const {classes}= this.props;
//   const theme=this.props.theme;
//   //  console.log(this.props.theme);
//   //  console.log(this.state.ymax)
//   //  console.log(this.state.ymin)
//   //  console.log(this.state.rangeUnits)

//   let legendTitle="";
//   let legendItem;
//   let legendItems=[];
//   let legendColor=[];
//   let pv;
//   let i=0;
//   let pvs=this.state.pvs;
//   let ymax=-1000000000000000000;
//   let ymin=1000000000000000000;
//   if(typeof this.props.lineColor !=='undefined'){
//     legendColor=this.props.lineColor;
//   }
//   else{

//       legendColor=theme.palette.reactVis.lineColors;


//   }
//   for (pv in pvs){

//     //console.log("linedata: ", this.state.pvs[pv].linedata);

//     i++;

//     if(pvs[pv].ymin<ymin){
//       ymin=pvs[pv].ymin;
//     }
//     if(pvs[pv].ymax>ymax){
//       ymax=pvs[pv].ymax
//     }

//   }

//   /*  if (ymin>0){
//   ymin=0.99*ymin;
// }
// else{
// ymin=1.01*ymin;
// }
// if(ymax>0){
// ymax=1.01*ymax;

// }
// else{
// ymax=0.99*ymax;
// }*/




// if (typeof this.props.legend !=='undefined'){
//   let i=0;
//   for(legendItem in this.props.legend){


//     legendItems.push({title:this.props.legend[legendItem].toString() ,color:legendColor[i], stroke:theme.palette.type=='dark'?'#80deea':'#dbdbe0'});

//     i++
//   }
// }
// //   console.log('ymax: ',this.state.ymax)
// //     console.log('ymin: ',this.state.ymin)
// let yDomain;
// if ((typeof this.props.ymax) !=='undefined'){


//   if ((typeof this.props.ymin)!=='undefined'){

//     yDomain=[this.props.ymin, this.props.ymax]
//   }
//   else {
//     yDomain=[ymin, ymax];
//   }
// }
// else {
//   yDomain=[ymin, ymax];
// }
// // console.log('ymax',ymax)
// //   console.log('ymin',ymin)

// return (

//   <React.Fragment >
//     {/* <ReactVisLightDarkTheme/> */}
//     {this.multipleDataConnections()}
//     <div style={{width:'100%',height:'100%'}} onContextMenu={this.handleToggleContextMenu}>
//       <FlexibleXYPlot  yDomain={yDomain} margin={{left: 60}} >
//         <ContextMenu
//           disableProbe={this.props.disableProbe}
//           open={this.state.openContextMenu}
//           anchorReference="anchorPosition"
//           anchorPosition={{ top: +this.state.y0, left: +this.state.x0 }}
//           probeType={'readOnly'}
//           pvs={this.state.contextPVs}
//           handleClose={this.handleContextMenuClose}
//           transformOrigin={{
//             vertical: 'top',
//             horizontal: 'left',
//           }}
//         />
//         <HorizontalGridLines 
//         //style={{stroke: theme.palette.type==='dark'?'#0097a7':'#B7E9ED'}} 
//         />
//         <VerticalGridLines  
//         //style={{stroke: theme.palette.type==='dark'?'#0097a7':'#B7E9ED'}} 
//         />
//         <XAxis
//           title={(typeof this.props.xAxisTitle !== 'undefined')?this.props.xAxisTitle:"X Axis"}
//           color="white"
//           tickFormat={v => typeof this.props.useTimeStamp!=='undefined'? this.calcTimeFormat(v):(v)+ this.props.xUnits}
//           tickTotal={4}
//           // style={{
//           //   title:{stroke:theme.palette.type==='dark'?'#dbdbe0':'#6b6b76',strokeWidth:0.2},
//           //   line: {stroke: '#ADDDE1'},
//           //   ticks: {stroke: '#ADDDE1'},
//           //   text: {stroke: 'none', fill: theme.palette.type==='dark'?'#a9a9b2':'#6b6b76', fontWeight: 600}
//           // }}
//         />

//         <YAxis
//           title={(typeof this.props.yAxisTitle !== 'undefined')?this.props.yAxisTitle:"Y Axis"}
//           left={9} tickFormat={this.props.yScaleLog10===true?v => "10E"+(v)+ " "+this.props.yUnits :v => (v)+ " "+this.props.yUnits} tickSize={20}  tickPadding={2}
//           // style={{
//           //   title:{stroke:theme.palette.type==='dark'?'#ccccce':'#dbdbe0',strokeWidth:0.2},
//           //   text: {stroke: 'none', fill: theme.palette.type==='dark'?'#a9a9b2':'#6b6b76', fontWeight: 600}
//           // }}
//           />
//         {this.multipleLineData()}


//         {(typeof this.props.legend !== 'undefined')&&<DiscreteColorLegend

//           style={{position: 'absolute', right: '50px', top: '10px',
//           //  color:theme.palette.type==='dark'?'#ccccce':'#dbdbe0',strokeWidth:0.2
//         }
//           }
//           orientation="horizontal" items= {legendItems}/>}

//       </FlexibleXYPlot>
//     </div>
//   </React.Fragment>



//     )
//   }

const PlotData = (props) => {


  const theme = useTheme()

  const calcTimeFormat = (timestamp) => {
    let mydate = new Date(timestamp * 1000);
    //  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    //  let year = mydate.getFullYear();
    // let month = months[mydate.getMonth()];
    //let date = mydate.getDate();
    let hour = mydate.getHours();
    let min = mydate.getMinutes();
    let sec = mydate.getSeconds();
    //let ms = mydate.getMilliseconds()
    //let value= hour + ':' + min + ':' + sec +':' + ms;
    let value;
    if (min < 10) {
      min = '0' + min;

    }

    if (sec < 10) {
      sec = '0' + sec;

    }
    value = hour + ':' + min + ':' + sec;

    return value;
  }
  const updateDataReducer = (pvs, newData) => {

    let newPvs = [...pvs];
    let { initialized } = newData.pvData;
    let value = initialized ? newData.pvData.value : [];
    if (!Array.isArray(value)) {
      value = [value]
    }
    let newX = [];
    let newY = [];
    let oldY;
    let oldX;
    if (initialized) {
      if (newPvs[newData.index]) {
        if (newPvs[newData.index].y) {
          oldY = newPvs[newData.index].y;
          if (newPvs[newData.index].x) {
            oldX = newPvs[newData.index].x;
          }
          else {
            oldX = [];
          }
        }
        else {
          oldY = [];
          oldX = [];
        }

        if (typeof props.maxLength !== "undefined") {
          // console.log("maxLength defined")
          newY = oldY.concat(value)
          if (newY.length > props.maxLength) {
            newY.splice(0, (newY.length - props.maxLength))
          }
          if (props.useTimeStamp) {
            newX = oldX.concat(new Date(newData.pvData.timestamp * 1000))
          }

        }
        else {
          newY = value;
        }
        if (props.useTimeStamp !== true) {
          if ((oldX.length !== newY.length)) {

            newX = Array.from(newY.keys());
          }
          else {
            newX = oldX
          }
        }



      }
      else {
        newX = props.useTimeStamp ? new Date(newData.pvData.timestamp * 1000) : Array.from(value.keys());
        newY = value;

      }
    }



    // else {
    //   newPvs = []
    //   newPvs.pvData = []

    // }
    newPvs[newData.index] = {
      x: newX,
      y: newY,
      type: 'scatter',
      mode: 'lines',
      marker: { color: props.lineColor ? props.lineColor[newData.index] : theme.palette.reactVis.lineColors[newData.index] },

      name: props.legend
        ?
        props.legend[newData.index]
          ?
          props.legend[newData.index]
          :
          replaceMacros(props.pvs[newData.index], props.macros)
        :
        replaceMacros(props.pvs[newData.index], props.macros),
      hovertemplate: props.yHoverFormat ?
        "(%{y:" + props.yHoverFormat + "}) %{x}<extra>%{fullData.name}</extra>"
        : "(%{y}) %{x}<extra>%{fullData.name}</extra>"
    };
    // newPvs.pvData[newData.index] ={...newPvs.pvData[newData.index],... newData.pvData};
    return newPvs;
  }


  const [data, updateData] = useReducer(updateDataReducer, []);
  const updatePolledDataReducer = (oldPvs, newData) => {
    let pvs = [...oldPvs];
    pvs[newData.index] = newData.pvData;

    return (pvs)

  }
  
  const [polledData, updatePolledData] = useReducer(updatePolledDataReducer, []);
  const polledDataRef=useRef(polledData);
  useEffect(()=>{
    polledDataRef.current=polledData;
  },[polledData])
  const [trigger3, setTrigger3] = useState(0);
  const {usePolling, pollingRate } = props;

  useEffect(() => {
   let timer;
   const update=()=>{
   // console.log(polledDataRef.current)
    polledDataRef.current.forEach((item,index)=>{
      // console.log(index,item)
      item.timestamp=Date.now()/1000;
      updateData({index,pvData:item})
    })
   }
   if (usePolling){
    timer=setInterval(update,pollingRate)
   }
   return ()=>{
    if (usePolling){
      clearInterval(timer)
     }
   }
  }, [usePolling,pollingRate])


  const contextInfoReducer = (oldPvs, newData) => {
    let pvs = [...oldPvs];
    pvs[newData.index] = newData.pvs[0];

    return (pvs)

  }
  const [contextInfo, updateContextInfo] = useReducer(contextInfoReducer, []);
  const [delayedData, setDelayedData] = useState([])
  const [delayedContextInfo, setDelayedContextInfo] = useState([])
  // const updateDataDebounced = useRef(debounce(value => setDelayedData(value), 50)).current;
  const [trigger, setTrigger] = useState(0);
  const { updateRate } = props;

  useEffect(() => {

    setTimeout(() => setTrigger(prev => prev + 1), parseInt(updateRate))
    setDelayedData(data)
  }, [trigger, updateRate])

  const [trigger2, setTrigger2] = useState(0);


  useEffect(() => {

    setTimeout(() => setTrigger2(prev => prev + 1), parseInt(1000))
    setDelayedContextInfo(contextInfo)
  }, [trigger2])

  // useEffect(()=>{
  //   updateDataDebounced(data)

  // },[data])
  const pvConnections = () => {
    let pvs = [];
    props.pvs.map((item, index) => {
      pvs.push(
        <PV
          key={index.toString()}
          pv={item}
          macros={props.macros}
          pvData={(pvData) => props.usePolling?updatePolledData({ index, pvData }):updateData({ index, pvData })}
          contextInfo={(pvs) => updateContextInfo({ index, pvs })}
          makeNewSocketIoConnection={props.makeNewSocketIoConnection}
        />)
    })
    return pvs
  }
  return (
    <React.Fragment>
      {pvConnections()}
      {props.children({ data: delayedData, contextInfo: delayedContextInfo })}
    </React.Fragment>
  )
}

const GraphY = (props) => {
  const classes = useStyles();
  const theme = useTheme()

  const paperRef = useRef(null);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleToggleContextMenu = (event) => {

    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.target);
    setOpenContextMenu(!openContextMenu);
  }
  const handleContextMenuClose = () => {
    setOpenContextMenu(false);
  }
  const [openContextMenu, setOpenContextMenu] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (paperRef.current) {
        setHeight(paperRef.current.offsetHeight)
        setWidth(paperRef.current.offsetWidth)
      }
    }
    // The 'current' property contains info of the reference:
    // align, title, ... , width, height, etc.
    if (paperRef.current) {
      setHeight(paperRef.current.offsetHeight)
      setWidth(paperRef.current.offsetWidth)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize);
  }, [paperRef]);

  const [domain, setDomain] = useState([0, 1])
  const [yPositions, setYPositions] = useState([0, 0, 0])
  useEffect(() => {
    if (props.yAxes !== undefined) {
      let numberOfyAxes = props.yAxes.length;
      let newYPositions = [];
      let increment = 100 / width;
      let newDomain = [increment * (numberOfyAxes - 1), 1]
      let index = 0;
      for (let i = numberOfyAxes - 1; i >= 0; i--) {
        newYPositions[index] = i * increment;
        index++;
      }
      setYPositions(newYPositions)
      setDomain(newDomain)
    }
    else {
      setYPositions([0])
      setDomain([0, 1])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width])
  const [yAxes, setYAxes] = useState(() => {
    let yAxesInit = {};
    if (props.yAxes !== undefined) {
      props.yAxes.forEach((item, index) => {
        let key = index === 0 ? 'yaxis' : 'yaxis' + (index + 1)
        if (index > 0) {
          yAxesInit[key] = {
            title: item.title ? item.title : "Y-Axis " + (index + 1),
            titlefont: { color: props.yAxes.length > 1 ? theme.palette.reactVis.lineColors[index] : theme.palette.reactVis[".rv-xy-plot__axis__tick__line"].stroke },
            tickfont: { color: props.yAxes.length > 1 ? theme.palette.reactVis.lineColors[index] : theme.palette.reactVis[".rv-xy-plot__axis__tick__line"].stroke },
            gridcolor: theme.palette.reactVis[".rv-xy-plot__grid-lines__line"].stroke,
            tickcolor: theme.palette.reactVis[".rv-xy-plot__axis__tick__line"].stroke,
            zerolinecolor: theme.palette.reactVis[".rv-xy-plot__axis__tick__line"].stroke,
            linecolor: theme.palette.reactVis[".rv-xy-plot__axis__tick__line"].stroke,
            zeroline: true,
            showline: true,
            showgrid: item.showGrid ? item.showGrid : true,
            side: 'left',
            position: yPositions[index],
            anchor: 'free',
            overlaying: 'y',
            type: item.type === 'log' ? 'log' : 'linear',
            tickformat: item.tickFormat ? item.tickFormat : ''
          }
        }
        else {
          yAxesInit['yaxis'] = {
            title: item.title ? item.title : "Y-Axis " + (index + 1),
            titlefont: { color: theme.palette.reactVis.lineColors[index], },
            tickfont: { color: theme.palette.reactVis.lineColors[index], },
            gridcolor: theme.palette.reactVis[".rv-xy-plot__grid-lines__line"].stroke,
            tickcolor: theme.palette.reactVis[".rv-xy-plot__axis__tick__line"].stroke,
            zerolinecolor: theme.palette.reactVis[".rv-xy-plot__axis__tick__line"].stroke,
            linecolor: theme.palette.reactVis[".rv-xy-plot__axis__tick__line"].stroke,
            zeroline: true,
            showline: true,
            showgrid: true,
            type: item.type === 'log' ? 'log' : 'linear',
            tickformat: item.tickFormat ? item.tickFormat : ''
          }
        }
      })
    }
    else {
      yAxesInit['yaxis'] = {
        title: props.yAxisTitle,
        gridcolor: theme.palette.reactVis[".rv-xy-plot__grid-lines__line"].stroke,
        tickcolor: theme.palette.reactVis[".rv-xy-plot__axis__tick__line"].stroke,
        zerolinecolor: theme.palette.reactVis[".rv-xy-plot__axis__tick__line"].stroke,
        linecolor: theme.palette.reactVis[".rv-xy-plot__axis__tick__line"].stroke,
        type: props.yScaleLog10 === true ? 'log' : 'linear',
        zeroline: true,
        showline: true,
        showgrid: true,
      }
    }
    return (yAxesInit)
  })
  const [legend, setLegend] = useState(() => {
    let legendInit = props.showLegend === true ? {
      legend: isMobile ? {
        orientation: 'h',
        x: 0,
        y: 1.1
      } : undefined
    } : {}
    return legendInit
  })

  const [layout, setLayout] = useState({})

  useEffect(() => {
    setLayout({
      title: {
        text: props.title,
      },
      plot_bgcolor: theme.palette.background.default,
      xaxis: {
        domain: domain,
        title: props.xAxisTitle,
        gridcolor: theme.palette.reactVis[".rv-xy-plot__grid-lines__line"].stroke,
        tickcolor: theme.palette.reactVis[".rv-xy-plot__axis__tick__line"].stroke,
        zerolinecolor: theme.palette.reactVis[".rv-xy-plot__axis__tick__line"].stroke,
        linecolor: theme.palette.reactVis[".rv-xy-plot__axis__tick__line"].stroke,
        zeroline: true,
        showline: true,
        showgrid: true,
        //  range: [selectedFromDate, selectedToDate],
      },
      ...yAxes,
      font: {
        family: 'Roboto,Arial',
        color: theme.palette.reactVis[".rv-xy-plot__axis__tick__line"].stroke
      },
      paper_bgcolor: theme.palette.background.default,
      ...legend,
      showlegend: props.showLegend,
      margin: { t: props.title ? 32 : 16, r: 32, l: 48, b: 48 }

    })
  }, [theme, props.showLegend, props.xAxisTitle, props.title])


  return (
    <div ref={paperRef} style={{ width: props.width, height: props.height, padding: 8, }}>

      <PlotData {...props}>
        {({ data, contextInfo }) => {
          return (
            <div style={{ width: "100%", height: "100%", paddingBottom: 32, }} onContextMenu={
              props.disableContextMenu ? undefined : handleToggleContextMenu
            }

              onPointerDownCapture={(event) => {
                if (event.button !== 0) {
                  event.preventDefault()
                  return;
                }
              }}
            >
              {contextInfo && openContextMenu && <ContextMenu
                disableProbe={props.disableProbe}
                open={openContextMenu}
                pvs={contextInfo}
                handleClose={handleContextMenuClose}
                probeType={'readOnly'}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}

              />}


              <Plot
                config={typeof props.displayModeBar !== "undefined" ? {
                  "displaylogo": false,
                  scrollZoom: false,
                  //     doubleclick: false,
                  displayModeBar: props.displayModeBar,
                  toImageButtonOptions: {
                    format: 'svg'
                  }
                } : {

                  "displaylogo": false,
                  scrollZoom: false,
                  toImageButtonOptions: {
                    format: 'svg'
                  }
                }
                }
                useResizeHandler={true}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '100%', height: '100%', paddingBottom: 8
                }}
                data={data}
                layout={{ ...layout, }}





              />
            </div>
          )
        }
        }

      </PlotData>

    </div>
  )

}
GraphY.propTypes = {

  /** Array of the process variables, NB must contain correct prefix ie: pva://  eg. ['pva://$(device):test$(id0)','pva://$(device):test$(id1)']*/
  pvs: PropTypes.array.isRequired,
  /** Values of macros that will be substituted in the pv name eg. {{'$(device)':'testIOC','$(id0)':'1','$(id1)':'2'}}*/
  macros: PropTypes.object,
  /** Y axis title. */
  yAxisTitle: PropTypes.string,
  /** X axis title. */
  xAxisTitle: PropTypes.string,

  /**
   * Show the plotly mode bar: if true, display permanently, if false hide permanently, if undefined it will display on hover.
   */
  displayModeBar: PropTypes.bool,
  /** Custom y axis minimum to be used,if not defined the graph will auto-scale */
  ymin: PropTypes.number,
  /** Custom y axis maximum to be used,if not defined the graph will auto-scale */
  ymax: PropTypes.number,

  /** If defined, then the DataConnection debugging information will be displayed*/
  debug: PropTypes.bool,
  /** If defined, then a legend will be displayed,using the string items defined in the array*/
  legend: PropTypes.array,
  /** If defined, then the default React-Vis line colors will be overridden using the string items defined in the array*/
  lineColor: PropTypes.array,
  /** If defined then the length of the line graphs will grow up until the value defined*/
  maxLength: PropTypes.number,
  /** Custom y axis units to be used*/
  yUnits: PropTypes.string,
  /** Custom x axis units to be used*/
  xUnits: PropTypes.string,
  /** Directive to sample the PV value, on the client side at the polling rate*/
  usePolling: PropTypes.bool,
  /** Directive to scale the y-axis as a log base 10 value*/
  yScaleLog10: PropTypes.bool,
  /** Polling interval in ms used in polling mode*/
  pollingRate: PropTypes.number,
  /** If defined then the graph will only update on a value change*/
  triggerOnSingleValueChange: PropTypes.bool,
  /** Directive to use PV timestamp on x-axis*/
  useTimeStamp: PropTypes.bool,
  /** Graph update perdiod in ms */
  updateRate: PropTypes.number,

  /**
         * The plotjs format overide for the y value. This is derived from the <a href="https://github.com/d3/d3-format/blob/v2.0.0/README.md#format">d3 format specification</a>
         * Example: ".3e" : exponential notation with 3 digits.
         *
         */
  yHoverFormat: PropTypes.string,

};

GraphY.defaultProps = {
  updateRate: 100,
  makeNewSocketIoConnection: false,
  debug: false,

  yAxisTitle: 'Y-axis',
  xAxisTitle: 'X-axis',
  yUnits: "",
  xUnits: "",
  usePolling: false,
  pollingRate: 100,
  width: '100%',
  height: '30vh',

};



export default GraphY
