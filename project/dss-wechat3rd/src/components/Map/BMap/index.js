/**
 * Created by love on 18/8/29.
 * @author trumpli<李志伟>
 */
const AK = 'CDnE5TUatGLRKSNa3YhWV5044S64GaBo';

const MAP_CONST = {
  BMAP_ANCHOR_BOTTOM_LEFT:-1,
  BMAP_UNIT_IMPERIAL:-1,
  BMAP_ANCHOR_TOP_LEFT:-1,
  BMAP_NAVIGATION_CONTROL_LARGE:-1,
  BMAP_ANCHOR_BOTTOM_RIGHT:-1,
  BMap:null
};

function initialization() {
  return new Promise(function (resolve, reject) {
    if(!!MAP_CONST.BMap){
      resolve(MAP_CONST.BMap);
    }
    else {
      window.dss_bd_callback = function () {
        for(let key in MAP_CONST){
          MAP_CONST[key] = window[key];
        }
        resolve(MAP_CONST['BMap']);
        delete window.dss_bd_callback;
      };
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "//api.map.baidu.com/api?v=2.0&ak="+AK+"&callback=dss_bd_callback";
      script.onerror = reject;
      document.head.appendChild(script);
    }
  })
}

function initializationMap(htmlId){
  return new Promise(function (resolve, reject) {
    initialization()
      .then((BMap)=> {
        
        const map = new BMap.Map(htmlId);
        //设置地图事件
        map.enableScrollWheelZoom();
        map.enableKeyboard();
        map.enableDragging();
        map.enableDoubleClickZoom();
      
        //向地图添加控件
        var scaleControl = new BMap.ScaleControl({anchor: MAP_CONST.BMAP_ANCHOR_BOTTOM_LEFT});
        scaleControl.setUnit(MAP_CONST.BMAP_UNIT_IMPERIAL);
        map.addControl(scaleControl);
        var navControl = new BMap.NavigationControl({
          anchor: MAP_CONST.BMAP_ANCHOR_TOP_LEFT,
          type: MAP_CONST.BMAP_NAVIGATION_CONTROL_LARGE
        });
        map.addControl(navControl);
		
        //定位当前城市
        (new BMap.LocalCity()).get((result)=>{
          var cityName = result.name;
          map.centerAndZoom(new BMap.Point(result.center.lng, result.center.lng.lat), 12);
          map.setCenter(cityName);
        });
        
        resolve({
          'instance':map,
          'Class':BMap
        });
      });
  });
  
}

export default {initializationMap}
