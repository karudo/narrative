Editor = require 'controllers/Editor'
Panel = require 'controllers/Panel'
DragImage = require 'controllers/DragImage'
#utils = require 'utils'
$ ->

  topimage = new DragImage el: $('.top-image')
  topimage.bind 'imageUpdated', (ob)=>
    if ob.width < topimage.el.width()
      alert "Ширина мала"
      topimage.makeEmpty()
    else
      h = if ob.height > 500 then 500 else ob.height
      $('.top-image').css height: h+'px'
    no

  panel = new Panel el: $ '.wyswyg'
  editor = new Editor
    el: $ '.post__content'
    panel: panel

  #console.log panel

