window.addEventListener('DOMContentLoaded', function() {
  var actionLock = false,
      currentKaiosVersion = '', enableCallRecordingActions = false

  function pickAndSetRingtone(prefix) {
  	actionLock = true
  	var ringPicker = new MozActivity({name: "pick"})
  	ringPicker.onsuccess = function(e) {
  	  var ringBlob = this.result.blob, ringBlobProp = prefix + '.ringtone',
  	  	  ringIdProp = ringBlobProp + '.id', 
  	  	  ringNameProp = ringBlobProp + '.name',
  	  	  setting = {}
  	  setting[ringBlobProp] = ringBlob
  	  setting[ringIdProp] = 'custom:1' 
  	  setting[ringNameProp] = this.result.name || 'Untitled'
	  var e = navigator.mozSettings.createLock().set(setting)
	  e.onsuccess = function() {
	  	window.alert('Рингтон установлен успешно!')
	    actionLock = false
	  }
	  e.onerror = function(e) {
	  	window.alert('Ошибка установки рингтона: ' + e.name)
	    actionLock = false
	  }
  	}
    ringPicker.onerror = function(e) {
	  window.alert('Ошибка выбора рингтона: ' + e.name)
	  actionLock = false
    }

  }

  CrossTweak.getSystemSetting('deviceinfo.os', function(resVer) {
	currentKaiosVersion = resVer
	enableCallRecordingActions = (parseInt(currentKaiosVersion.split('.').slice(0,3).join('')) >= 252)
	if(!enableCallRecordingActions)
	  document.querySelector('.callrec').classList.add('disabled')
  })
  
  window.addEventListener('keydown', function(e) {
    if(!actionLock) {
      switch(e.key) {
        case '1': //set arbitrary ringtone
          pickAndSetRingtone('dialer')
          break
        case '2': //set arbitrary notification tone
          pickAndSetRingtone('notification')
          break
        case '3': //call recording AUTO/ON/OFF
          if(enableCallRecordingActions) {
            CrossTweak.getSystemSetting('callrecording.mode', function(curMode) {
              var nextMode = 'on'
              if(curMode === 'auto') nextMode = 'off'
              else if(curMode === 'on') nextMode = 'auto'
              CrossTweak.enableCallRecording(nextMode, 'wav', function() {
                var msgs = {
                  'on': 'установлено на ручной режим',
                  'auto': 'установленно на автоматический режим',
                  'off': 'выключена'
                }
                window.alert('Запись звонков ' + msgs[nextMode])
              }, function(e) {
                window.alert('Ошибка: ' + e)
              })
            }, function(e) {
              window.alert('Ошибка: ' + e)
            })
          } else window.alert('Простите, запись звонков достапна в KaiOS 2.5.2 и выше, а у вас' + currentKaiosVersion)
          break
        case '4': //install app package
          actionLock = true
          var pickPackage = new MozActivity({name: "pick"})
          pickPackage.onsuccess = function() {
            CrossTweak.installPkg(this.result.blob, function() {
              window.alert('App ' + pickPackage.result.blob.name + ' успешно устновленно')
              actionLock = false
            }, function(e) {
              if(e.toString() === 'InvalidPrivilegeLevel')
                window.alert('Недостаточно прав. Включите меню разработчика (#) перед попыткой установить пакет приложения.')
              else
                window.alert('Ошибка установки приложения: ' + e)
              actionLock = false
            })
          }
          pickPackage.onerror = function(e) {
            window.alert('Ошибка выбора пакета приложения: ' + e.name)
            actionLock = false
          }
          break
        case '5': //Enable developer menu
        	CrossTweak.setSystemSetting('developer.menu.enabled', true, function() {
        	  window.alert('Меню разработчика включено')
        	}, function(e) {window.alert('Ошибка: ' + e)})
          break
        case '6': //Enter Engineering menu
          var a = new MozActivity({name:"engmode"})
          break
        case '7': //Proxy on/off
          CrossTweak.getSystemSetting('browser.proxy.enabled', function(res) {
            var newVal = !(res === true)
            CrossTweak.setSystemSetting('browser.proxy.enabled', newVal, function() {
              window.alert('Прокси ' + (newVal ? 'включен' : 'выключен') + ' успешно')
            }, function(e) {
              window.alert('Не удалось ' + (newVal ? 'включить' : 'выключить') + ' прокси: ' + e)
            })
          }, function(e) {
            window.alert('Ошибка: ' + e)
          })
          break
        case '8': //Set proxy host/port
          actionLock = true
          CrossTweak.getSystemSetting('browser.proxy.host', function(oldHost) {
            CrossTweak.getSystemSetting('browser.proxy.port', function(oldPort) {
              var newHost = window.prompt('Прокси хост', oldHost || '')
              var newPort = Number(window.prompt('Прокси порт', oldPort || ''))
              if(newHost && newPort) {
                CrossTweak.setSystemSetting('browser.proxy.host', newHost, function() {
                  CrossTweak.setSystemSetting('browser.proxy.port', newPort, function() {
                    window.alert('Прокси установлен успешно')
                    actionLock = false
                  }, function(e) {
                    window.alert('Ошибка установки порта прокси: ' + e)
                    actionLock = false
                  })
                }, function(e) {
                  window.alert('Ошибка установки хоста прокси: ' + e)
                  actionLock = false
                })
              }
              else {
                window.alert('Ошибка: нельзя установить пустой порт или хост прокси')
                actionLock = false
              }
            }, function(e) {
              window.alert('Ошибка: ' + e)
              actionLock = false
            })
          }, function(e) {
            window.alert('Ошибка: ' + e)
            actionLock = false
          })
          break
        case '9': //view and modify arbitrary MozSetting
          var setting = window.prompt('')
          if(setting) {
          	CrossTweak.getSystemSetting(setting, function(value) {
			  if(value instanceof Blob) {
				window.alert('Настройка ' + setting + ' имеет значение Blob, CrossTweak не может его просмотреть')
			  }
			  else {
				if(window.confirm('Текущее значение ' + setting + ' \n' + value + '\nХотите изменить данную настройку?')) {
					var newVal = window.prompt('Введите новое значение: ', value || '')
					var vtl = newVal.toLowerCase().trim()
					if(vtl === 'true') newVal = true
					else if(vtl === 'false') newVal = false
					CrossTweak.setSystemSetting(setting, newVal, function(){window.alert('Значение настройки ' + setting + ' успешно обновлено!')}, function(e){window.alert('Ошибка: ' + e)})
				}
			  }
			}, function(e) {
				window.alert('Ошибка: ' + e)
          	})
          }
          break
        case '#': //privileged reset just like in OmniSD
          if(window.confirm('Выполнить привилегированный сброс? Все выши данные будут удалены!'))
          	CrossTweak.privilegedFactoryReset()
          break
        default:
          break
      }
    }
  })
}, false)
