export function initLineFlowMaterialProperty(Cesium) {
  /*
   * @Description: 飞线效果（参考开源代码）
   * @Version: 1.0
   * @Author: Julian
   * @Date: 2022-03-05 16:13:21
   * @LastEditors: Julian
   * @LastEditTime: 2022-03-05 17:39:38
   */
  class LineFlowMaterialProperty {
    constructor(options) {
      this._definitionChanged = new Cesium.Event()
      this._color = undefined
      this._speed = undefined
      this._percent = undefined
      this._gradient = undefined
      this.color = options.color
      this.speed = options.speed
      this.percent = options.percent
      this.gradient = options.gradient
    }

    get isConstant() {
      return false
    }

    get definitionChanged() {
      return this._definitionChanged
    }

    getType(time) {
      return Cesium.Material.LineFlowMaterialType
    }

    getValue(time, result) {
      if (!Cesium.defined(result)) {
        result = {}
      }

      result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color)
      result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 5.0, result.speed)
      result.percent = Cesium.Property.getValueOrDefault(this._percent, time, 0.1, result.percent)
      result.gradient = Cesium.Property.getValueOrDefault(this._gradient, time, 0.01, result.gradient)
      return result
    }

    equals(other) {
      return (
        this === other ||
        (other instanceof LineFlowMaterialProperty &&
          Cesium.Property.equals(this._color, other._color) &&
          Cesium.Property.equals(this._speed, other._speed) &&
          Cesium.Property.equals(this._percent, other._percent) &&
          Cesium.Property.equals(this._gradient, other._gradient))
      )
    }
  }

  Object.defineProperties(LineFlowMaterialProperty.prototype, {
    color: Cesium.createPropertyDescriptor('color'),
    speed: Cesium.createPropertyDescriptor('speed'),
    percent: Cesium.createPropertyDescriptor('percent'),
    gradient: Cesium.createPropertyDescriptor('gradient')
  })

  Cesium.LineFlowMaterialProperty = LineFlowMaterialProperty
  Cesium.Material.LineFlowMaterialProperty = 'LineFlowMaterialProperty'
  Cesium.Material.LineFlowMaterialType = 'LineFlowMaterialType'
  Cesium.Material.LineFlowMaterialSource = `
        uniform vec4 color;
        uniform float speed;
        uniform float percent;
        uniform float gradient;
        
        czm_material czm_getMaterial(czm_materialInput materialInput){
          czm_material material = czm_getDefaultMaterial(materialInput);
          vec2 st = materialInput.st;
          float t =fract(czm_frameNumber * speed / 1000.0);
          t *= (1.0 + percent);
          float alpha = smoothstep(t- percent, t, st.s) * step(-t, -st.s);
          alpha += gradient;
          material.diffuse = color.rgb;
          material.alpha = alpha;
          return material;
        }
        `

  Cesium.Material._materialCache.addMaterial(Cesium.Material.LineFlowMaterialType, {
    fabric: {
      type: Cesium.Material.LineFlowMaterialType,
      uniforms: {
        color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
        speed: 10.0,
        percent: 0.1,
        gradient: 0.01
      },
      source: Cesium.Material.LineFlowMaterialSource
    },
    translucent: function (material) {
      return true
    }
  })
}

/**
 * @description: 抛物线构造函数（参考开源代码）
 * @param {*}
 * @return {*}
 */
export function parabola(Cesium, startPosition, endPosition, height = 0, count = 50) {
  // 方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
  const result = []
  height = Math.max(+height, 100)
  count = Math.max(+count, 50)
  const diffLon = Math.abs(startPosition[0] - endPosition[0])
  const diffLat = Math.abs(startPosition[1] - endPosition[1])
  const L = Math.max(diffLon, diffLat)
  let dlt = L / count
  if (diffLon > diffLat) {
    // base on lon
    const delLat = (endPosition[1] - startPosition[1]) / count
    if (startPosition[0] - endPosition[0] > 0) {
      dlt = -dlt
    }
    for (let i = 0; i < count; i++) {
      const h = height - (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * height) / Math.pow(L, 2)
      const lon = startPosition[0] + dlt * i
      const lat = startPosition[1] + delLat * i
      // eslint-disable-next-line new-cap
      const point = new Cesium.Cartesian3.fromDegrees(lon, lat, h)
      result.push(point)
    }
  } else {
    // base on lat
    const delLon = (endPosition[0] - startPosition[0]) / count
    if (startPosition[1] - endPosition[1] > 0) {
      dlt = -dlt
    }
    for (let i = 0; i < count; i++) {
      const h = height - (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * height) / Math.pow(L, 2)
      const lon = startPosition[0] + delLon * i
      const lat = startPosition[1] + dlt * i
      // eslint-disable-next-line new-cap
      const point = new Cesium.Cartesian3.fromDegrees(lon, lat, h)
      result.push(point)
    }
  }
  return result
}
