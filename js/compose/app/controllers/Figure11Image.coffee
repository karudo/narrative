Figure = require 'controllers/Figure'


class Figure11Image extends Figure
  constructor: ->
    super

  init: ->
    @el.addClass('figure_many figure_wide no-edit').attr 'contenteditable', 'false'
    @html """<div class="image-border">
          <div class="image-upload image-container image-upload-1" style="height:550px; width:500px;"></div>
          <div class="image-upload image-container image-upload-2" style="height:550px; width:500px;"></div>
      </div>"""
    DragImage = require 'controllers/DragImage'
    @dragImages[1] = new DragImage el: @$('.image-upload-1')
    @dragImages[2] = new DragImage el: @$('.image-upload-2')

    
module.exports = Figure11Image