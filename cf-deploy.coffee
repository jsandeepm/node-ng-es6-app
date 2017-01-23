module.exports = (cfDeploy) ->
  {namePostfix, serverPostfix} = cfDeploy.args

  startupCommand: 'npm start'
  cfBaseName: 'node-ng-es6-app-ui'
  deployable: '.'
  diskLimit: "256M"
  instances: 1
  memoryLimit: "256M"
  services: [
    "url-row-crop-naming-services#{namePostfix}"
  ]
  smokeTest: (options) -> [
    'http://' + options.tempServerInternal
   ]