import { read, utils } from 'xlsx'

// 导入核心函数
export const importfile = function (obj, func) {
  const reader = new FileReader()
  reader.readAsArrayBuffer(obj.originFileObj) // 需要传blob类型
  reader.onload = () => {
    const buffer = reader.result
    const bytes = new Uint8Array(buffer)
    const length = bytes.byteLength
    let binary = ''
    for (let i = 0; i < length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    const wb = read(binary, {
      type: 'binary'
    })
    const outdata = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
    if (func instanceof Function) func(outdata)
  }
}
