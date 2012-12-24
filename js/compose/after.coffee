Editor = require 'controllers/Editor'
Panel = require 'controllers/Panel'
DragImage = require 'controllers/DragImage'
#utils = require 'utils'
$ ->
  panel = new Panel el: $ '.wyswyg'
  topimage = new DragImage el: $('.top-image'), noManage: no
  topimage.bind 'imageUpdated', (ob)=> $('.top-image').css height: ob.height+'px'
  editor = new Editor
    el: $ '.compose__text'
    panel: panel

  #console.log panel

