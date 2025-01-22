<template>
  <!-- <vc-viewer
    :home-button="homeButton"
    :scene-mode-picker="sceneModePicker"
    :base-layer-picker="baseLayerPicker"
    :animation="animation"
    :info-box="infoBox"
    :selection-indicator="selectionIndicator"
    :geocoder="geocoder"
    :timeline="timeline"
    :fullscreen-button="fullscreenButton"
    :should-animate="shouldAnimate"
    :navigation-help-button="navigationHelpButton"
    :camera.sync="camera"
    class="viewer"
    @ready="ready"
  >
    <vc-layer-imagery>
      <vc-provider-imagery-openstreetmap></vc-provider-imagery-openstreetmap>
    </vc-layer-imagery>
  </vc-viewer> -->
  <div id="cesiumContainer"></div>
</template>

<script>
import { initLineFlowMaterialProperty, parabola } from './lineFlow'
// import * as Cesium from 'cesium'
// const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/'
export default {
  data() {
    return {
      // homeButton: false, // 是否显示主页按钮
      // sceneModePicker: true, // 是否切换场景
      // baseLayerPicker: false, // 影像切换
      // animation: true, // 是否显示动画控件
      // infoBox: true, // 是否显示点击要素之后显示的信息
      // selectionIndicator: true, // 要素选中框
      // geocoder: false, // 是否显示地名查找控件
      // timeline: false, // 是否显示时间线控件
      // fullscreenButton: true, // 是否全屏
      // shouldAnimate: false, // 是否动画
      // navigationHelpButton: false, // 是否显示帮助信息控件
      // camera: {
      //   position: {
      //     lng: 105.79599505,
      //     lat: 36.99518115,
      //     height: 8000000
      //   },
      //   heading: 360,
      //   pitch: -90,
      //   roll: 0
      // }
    }
  },
  mounted() {
    this.ready()
  },
  methods: {
    ready(cesiumInstance) {
      // const { Cesium, viewer } = cesiumInstance
      // eslint-disable-next-line no-undef
      const viewer = new Cesium.Viewer('cesiumContainer', {
        homeButton: false, // 是否显示主页按钮
        sceneModePicker: true, // 场景模型切换（二维三维切换）
        baseLayerPicker: false, // 影像切换
        animation: true, // 是否显示动画控件
        infoBox: true, // 是否显示点击要素之后显示的信息
        selectionIndicator: true, // 要素选中框
        geocoder: false, // 是否显示地名查找控件
        timeline: false, // 是否显示时间线控件
        fullscreenButton: true, // 是否显示全屏按钮
        shouldAnimate: false, // true 时钟默认尝试提前模拟时间
        navigationHelpButton: false, // 是否显示帮助信息控件
        imageryProvider: false // 底图
        // eslint-disable-next-line no-undef
        // imageryProvider: new Cesium.SingleTileImageryProvider({
        //   url: this.createColorCanvas('#FFF'),
        //   // eslint-disable-next-line no-undef
        //   rectangle: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0)
        // })
      })
      const centerLon = 105.21246579
      const centerLat = 37.1468502
      const height = 4557274.859244296
      // 镜头拉近
      // viewer.camera.zoomIn(height * 2)
      viewer.camera.flyTo({
        // eslint-disable-next-line no-undef
        destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height * 2),
        duration: 1.0
      })
      // 隐藏logo
      viewer.cesiumWidget.creditContainer.style.display = 'none'
      // 添加地图瓦片
      // eslint-disable-next-line no-undef
      this.addMapTile(Cesium, viewer)
      // 添加物体
      // eslint-disable-next-line no-undef
      this.addEntities(Cesium, viewer)
      // 初始化飞线函数
      // eslint-disable-next-line no-undef
      initLineFlowMaterialProperty(Cesium)
      // 添加飞线效果
      // eslint-disable-next-line no-undef
      this.parabolaFlowInit(Cesium, viewer, 3)
      // 屏幕缩放事件
      // eslint-disable-next-line no-undef
      this.handleScreenSpaceEvent(Cesium, viewer)
    },
    // 创建默认图层
    // createColorCanvas(color) {
    //   const width = 1
    //   const height = 1
    //   const canvas = document.createElement('canvas')
    //   canvas.width = width
    //   canvas.height = height
    //   const ctx = canvas.getContext('2d')
    //   ctx.fillStyle = color
    //   ctx.fillRect(0, 0, width, height)
    //   return canvas.toDataURL()
    // },
    addMapTile(Cesium, viewer) {
      var layers = viewer.scene.imageryLayers
      layers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: '/gis/tile/googleSatellite/{z}/{x}/{y}',
          // url: "/gis/tile/googleNormal/{z}/{x}/{y}",
          format: 'image/png'
        })
      )
    },
    addEntities(Cesium, viewer) {
      const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/'
      // 放置物体
      const pos = [
        {
          name: '北京主中心站',
          lng: 40.22077, // 经度
          lat: 116.23128, // 纬度
          color: [255, 255, 0, 0.5], // RGBA
          hpr: [180, 0, 0]
        },
        {
          name: '兰州分中心站',
          lng: 36.10396, // 经度
          lat: 103.71878, // 纬度
          color: [255, 255, 0, 0.5], // RGBA
          hpr: [0, 0, 0]
        },
        {
          name: '漠河小站',
          lng: 52.97209, // 经度
          lat: 122.53864, // 纬度
          color: [255, 255, 0, 0.5], // RGBA
          hpr: [180, 0, 0]
        },
        {
          name: '阿勒泰小站',
          lng: 47.84564, // 经度
          lat: 88.14023, // 纬度
          color: [255, 255, 0, 0.5], // RGBA
          hpr: [0, 0, 0]
        },
        {
          name: '昆明小站',
          lng: 24.88554, // 经度
          lat: 102.82147, // 纬度
          color: [255, 255, 0, 0.5], // RGBA
          hpr: [-90, 0, 0]
        }
      ]

      pos.forEach((item) => {
        const hpr = new Cesium.HeadingPitchRoll(
          Cesium.Math.toRadians(item.hpr[0]),
          Cesium.Math.toRadians(item.hpr[1]),
          Cesium.Math.toRadians(item.hpr[2])
        )
        const position = Cesium.Cartesian3.fromDegrees(item.lat, item.lng, 1000)
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr)

        const entity = viewer.entities.add({
          id: item.name,
          name: item.name,
          position: Cesium.Cartesian3.fromDegrees(item.lat, item.lng, 1000),
          orientation: orientation,
          model: {
            uri: `${publicPath}glb/ground_satellite_station_ii.glb`,
            scale: 100000
            // color: new Cesium.Color(item.color[0], item.color[1], item.color[2], item.color[3]),
          },
          label: {
            id: item.name,
            text: item.name,
            fillColor: Cesium.Color.CYAN,
            scale: 0.6,
            pixelOffset: new Cesium.Cartesian2(0, 20)
          }
        })
        entity.description = `<div>
            <div style="display:flex;align-items:center;height:24px">
              <div style="width: 160px;text-align: justify;text-align-last: justify;">设备HID：</div>
              <div style="display: inline-block;width: 100%;">E6-5A-80-28-79-53</div>
            </div>
            <div style="display:flex;align-items:center;height:24px">
              <div style="width: 160px;text-align: justify;text-align-last: justify;">入网时间：</div>
              <div style="display: inline-block;width: 100%;">2023-08-07 10:58</div>
            </div>
            <div style="display:flex;align-items:center;height:24px">
              <div style="width: 160px;text-align: justify;text-align-last: justify;">管理地址：</div>
              <div style="display: inline-block;width: 100%;">192.169.20.78</div>
            </div>
            <div style="display:flex;align-items:center;height:24px">
              <div style="width: 160px;text-align: justify;text-align-last: justify;">前向信息速率：</div>
              <div style="display: inline-block;width: 100%;">500 kbps</div>
            </div>
            <div style="display:flex;align-items:center;height:24px">
              <div style="width: 160px;text-align: justify;text-align-last: justify;">前向流量：</div>
              <div style="display: inline-block;width: 100%;">20 MB</div>
            </div>
            <div style="display:flex;align-items:center;height:24px">
              <div style="width: 160px;text-align: justify;text-align-last: justify;">前向信噪比：</div>
              <div style="display: inline-block;width: 100%;">10 db</div>
            </div>
            <div style="display:flex;align-items:center;height:24px">
              <div style="width: 160px;text-align: justify;text-align-last: justify;">返向信息速率：</div>
              <div style="display: inline-block;width: 100%;">500 kbps</div>
            </div>
            <div style="display:flex;align-items:center;height:24px">
              <div style="width: 160px;text-align: justify;text-align-last: justify;">返向信噪比：</div>
              <div style="display: inline-block;width: 100%;">10 db</div>
            </div>

          </div>`
      })
    },
    /**
     * @description: 抛物飞线效果初始化
     * @param {*} _viewer
     * @param {*} _num :每条线上的飞线数量
     * @return {*}
     */
    parabolaFlowInit(Cesium, _viewer, _num) {
      const _positions = [
        {
          center: [116.23128, 40.22077],
          target: [
            [122.53864, 52.97209],
            [88.14023, 47.84564]
          ]
        },
        {
          center: [103.71878, 36.10396],
          target: [[102.82147, 24.88554]]
        }
      ]
      _positions.forEach((item) => {
        item.target.forEach((tg) => {
          const _siglePositions = parabola(Cesium, item.center, tg, 100000)
          // 创建飞线
          for (let i = 0; i < _num; i++) {
            _viewer.entities.add({
              polyline: {
                positions: _siglePositions,
                material: new Cesium.LineFlowMaterialProperty({
                  // color: new Cesium.Color(1.0, 1.0, 0.0, 0.8),
                  color: Cesium.Color.GREENYELLOW,
                  speed: 15 * Math.random(),
                  percent: 0.2,
                  gradient: 0.05
                })
              }
            })
          }
          // 创建轨迹线
          _viewer.entities.add({
            polyline: {
              positions: _siglePositions,
              material: new Cesium.Color(1.0, 1.0, 0.0, 0.2)
            }
          })
        })
      })
    },
    handleScreenSpaceEvent(Cesium, viewer) {
      // 定义当前场景的画布元素的事件处理
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      // 设置鼠标滚动事件的处理函数，这里负责对相机高度进行控制
      handler.setInputAction(function (e) {
        // 获取当前镜头位置的笛卡尔坐标
        const cameraPos = viewer.camera.position
        // 获取当前坐标系标准
        const ellipsoid = viewer.scene.globe.ellipsoid
        // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
        const cartographic = ellipsoid.cartesianToCartographic(cameraPos)
        // 获取镜头的高度
        const height = cartographic.height

        console.log('cartographic.longitude, latitude', cartographic.longitude, cartographic.latitude, height)

        // 滚轮往前滚，镜头拉近
        // if (e > 0) {
        //   // 镜头拉近
        //   viewer.camera.zoomIn(height / 3);
        // } else {
        //   // 镜头远离
        //   viewer.camera.zoomOut(height * 1.2);
        // }

        // 根据上面当前镜头的位置，获取该中心位置的经纬度坐标
        const centerLon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8))
        const centerLat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8))
        console.log('centerLon, centerLat', centerLon, centerLat)
      }, Cesium.ScreenSpaceEventType.WHEEL)
    }
  }
}
</script>

<style>
#cesiumContainer {
  width: 100%;
  height: calc(100vh - 80px);
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.viewer {
  width: 100%;
  height: 100%;
}

/* 去除logo */
.cesium-widget-credits {
  display: none !important;
}
/* 修改信息框宽高 */
.cesium-infoBox-visible {
  width: 300px !important;
  height: 240px !important;
}
</style>
