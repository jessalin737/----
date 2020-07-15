var app = getApp()
var temp = []
var string_temp = ""
var serviceId = "00001801-0000-1000-8000-00805f9b34fb"
var characteristicId = "00001801-0000-1000-8000-00805f9b34fb"
var services = [] //蓝牙设备主 service列表
var serviceId = []//serviceId

Page({
  data: {
    isbluetoothready: false,
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    searchingstatus: false,
    receivedata: '666',
    onreceiving: false,
    id_text: string_temp,
    list: [],
    receive_data: 'none  '
  },

  onLoad: function() {},

  open_BLE: function() {
    var that = this
    that.setData({
      isbluetoothready: !that.data.isbluetoothready,
    })
    if (that.data.isbluetoothready) {
      //开启蓝牙模块并初始化
      wx.openBluetoothAdapter({
        success: function(res) {
          console.log('初始化蓝牙适配器返回' + JSON.stringify(res))
        },

        fail: function(res) {
          console.log('初始化蓝牙适配器失败' + JSON.stringify(res))
          wx.showModal({
            title: '提示',
            content: '请检查手机蓝牙是否打开',
          })

        }

      })
      //开启蓝牙模块并初始化


      //检查蓝牙模块是否初始化成功
      wx.getBluetoothAdapterState({
        success: function(res) {
          var available = res.available
          if (!available) {
            wx.showToast({
              title: '蓝牙初始化失败',
              icon: 'loading',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '蓝牙初始化成功',
              icon: 'success',
              duration: 2000
            })

          }

        }

      })
      //检查蓝牙模块是否初始化成功

    } else {
      wx.closeBLEConnection({
        deviceId: that.data.connectedDeviceId,
        complete: function(res) {
          that.setData({
            deviceconnected: false,
            connectedDeviceId: ""
          })

          wx.showToast({
            title: '蓝牙连接断开',
            icon: 'success',
            duration: 2000
          })
        }

      })

      setTimeout(function() {
        that.setData({
          list: []
        })

        //释放蓝牙适配器

        wx.closeBluetoothAdapter({
          success: function(res) {
            that.setData({
              isbluetoothready: false,
              deviceconnected: false,
              devices: [],
              searchingstatus: false,
              receivedata: ''
            })

            wx.showToast({
              title: '蓝牙适配器释放',
              icon: 'success',
              duration: 2000
            })
          },

          fail: function(res) {}

        })

        //释放蓝牙适配器

      }, 1000)

    }

  },



  search_BLE: function() {
    temp = []
    var that = this
    if (!that.data.searchingstatus) {
      var that = this
      //开始搜索附近蓝牙设备
      wx.startBluetoothDevicesDiscovery({
        success: function(res) {
          wx.showToast({
            title: '开始搜索BLE',
            icon: 'loading',
            duration: 2000
          })

          that.setData({
            searchingstatus: !that.data.searchingstatus
          })

        }

      })
      //开始搜索附近蓝牙设备

    } else {
      //停止搜索附近蓝牙设备
      wx.stopBluetoothDevicesDiscovery({
        success: function(res) {
          wx.showToast({
            title: '停止搜索BLE',
            icon: 'success',
            duration: 2000
          })

          that.setData({
            searchingstatus: !that.data.searchingstatus
          })
        }
      })
      //停止搜索附近蓝牙设备

      setTimeout(function() {
        //获取发现的蓝牙设备
        wx.getBluetoothDevices({
          success: function(res) {
            for (var i = 0; i < 100; i++) {
              if (res.devices[i]) {
                string_temp = string_temp + '\n' + res.devices[i].deviceId
              }
            }

            that.setData({
              id_text: string_temp,
              list: res.devices
            })
          }
        })
        //获取发现的蓝牙设备

      }, 1000)

    }
  },

  connectTO: function(e) {
    var that = this
    wx.showLoading({
      title: '连接蓝牙设备中...',
    })

    wx.createBLEConnection({
      deviceId: e.currentTarget.id,
      success: function(res) {
        wx.hideLoading()
        wx.showToast({
          title: '连接成功',
          icon: 'success',
          duration: 1000
        })

        that.setData({
          deviceconnected: true,
          connectedDeviceId: e.currentTarget.id
        })
        //跳转至首页
        wx.switchTab({
          url: '/pages/home/home',
        })


        //获取所有服务 serviceId
        wx.getBLEDeviceServices({
          deviceId: e.currentTarget.id,
          success: function(res) {
            console.log(res.services);
            var i = 0;
            while (res.services[i]) {
              serviceId[i] = res.services[i].uuid;
              console.log(serviceId[i]);
              i++;
            }
          },
        })

        //获取所有特征值 characteristicId
        wx.getBLEDeviceCharacteristics({
          deviceId: e.currentTarget.id,
          serviceId: serviceId,
          success: function(res) {
            var that = this
            console.log(that.data);
            if (res.characteristics) {
              console.log("有特征值");
              for (var i = 0; i < res.characteristics.length; i++) {
                if (res.characteristics[i].properties.notify) {
                  console.log("notifyServiceId", that.data.services[i].uuid);
                  console.log("notifyCharacteristicsId", res.characteristics[i].uuid);
                  that.setData({
                    notifyServiceId: that.data.services[i].uuid,
                    notifyCharacteristicsId: res.characteristics[i].uuid,
                  })
                } else if (res.characteristics[i].properties.read) {
                  console.log("readServiceId", that.data.services[i].uuid);
                  console.log("readCharacteristicsId", res.characteristics[i].uuid);
                  that.setData({
                    readServiceId: that.data.services[i].uuid,
                    readCharacteristicsId: res.characteristics[i].uuid,
                  })
                }
              }
            }
            // console.log("11111111111111");

            // console.log("00000000000000");
            that.setData({
              msg: JSON.stringify(res.characteristics),
            })
          },
          fail: function(res) {
            console.log("fail");
          },
          complete: function(res) {
            console.log("complete");
          }
        })

        // 开启notify并监听数据
        wx.notifyBLECharacteristicValueChange({
          state: true,
          deviceId: that.data.connectedDeviceId,
          serviceId: that.data.serviceId,
          characteristicId: that.data.characteristicId,
          success: function(res) {
            console.log('notifyBLECharacteristicValueChange success', res.errMsg)
          }

        })
        //开启notify并监听数据

        // ArrayBuffer转16进制字符串
        function ab2hex(buffer) {
          var hexArr = Array.prototype.map.call(
            new Uint8Array(buffer),
            function(bit) {
              return ('00' + bit.toString(16)).slice(-2)
            }
          )
          return hexArr.join('');
        }

        // 16进制数转ASCLL码          
        function hexCharCodeToStr(hexCharCodeStr) {
          var trimedStr = hexCharCodeStr.trim();
          var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
          var len = rawStr.length;
          var curCharCode;
          var resultStr = [];
          for (var i = 0; i < len; i = i + 2) {
            curCharCode = parseInt(rawStr.substr(i, 2), 16);
            resultStr.push(String.fromCharCode(curCharCode));
          }
          return resultStr.join("");
        }


        //监听特征值变化
        wx.onBLECharacteristicValueChange(function(characteristic) {
          console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
          console.log('characteristic value comed:', ab2hex(res.value))
          var hex = ab2hex(characteristic.value)
          that.setData({
            receive_data: hexCharCodeToStr(hex)
          })

        })

      },

      fail: function(res) {
        wx.hideLoading()
        wx.showToast({
          title: '连接设备失败',
          icon: 'success',
          duration: 1000
        })

        that.setData({
          connected: false
        })

      }

    })
    //停止搜索
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {}

    })

  },

  receiveMessages: function() {
    var that = this;
    wx.readBLECharacteristicValue({
      deviceId: that.data.connectedDeviceId,
      serviceId: that.data.readServiceId,
      characteristicId: that.data.readCharacteristicsId,
      success: function(res) {
        console.log('readBLECharacteristicValue:', res.errCode)
      }
    })

  },

})