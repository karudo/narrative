Figure = require 'controllers/Figure'

class FigureSingeImage extends Figure
  constructor: ->
    super
    console.log @

  init: ->
    @el.addClass('no-edit').attr 'contenteditable', 'false'

    @html """<div class="image-border">
        <div class="image-upload image-container" style="height:456px; width:640px;"></div>
      </div>"""
    DragImage = require 'controllers/DragImage'
    cdi = @dragImages[1] = new DragImage el: @$('.image-upload'), noManage: no
    cdi.bind 'imageUpdated', (ob)=> @$('.image-upload').css height: ob.height+'px'

    
module.exports = FigureSingeImage