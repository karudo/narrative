Figure = require 'controllers/Figure'

class FigureSingeImage extends Figure
  constructor: ->
    super
    #console.log @

  init: ->
    @el.addClass('no-edit').attr 'contenteditable', 'false'

    @html require('templates')('figuresingle')
    DragImage = require 'controllers/DragImage'
    cdi = @dragImages[1] = new DragImage el: @$('.image-upload')
    cdi.bind 'imageUpdated', (ob)=> @$('.image-upload').css height: ob.height+'px'

    
module.exports = FigureSingeImage