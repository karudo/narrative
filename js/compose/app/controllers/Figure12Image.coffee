Figure = require 'controllers/Figure'

class Figure12Image extends Figure
  constructor: ->
    super

  init: ->
    @el.addClass('figure_many figure_wide no-edit').attr 'contenteditable', 'false'
    @html """<div class="image-border">
      <div class="image-upload image-container image-upload-1" style="height:500px; width:500px;"></div>
      <div class="image-container">
        <div class="image-upload image-container image-upload-2" style="height:250px; width:500px;"></div>
      </div>
      <div class="image-container">
        <div class="image-upload image-container image-upload-3" style="height:250px; width:500px;"></div>
      </div>
      </div>"""
    DragImage = require 'controllers/DragImage'
    @dragImages[1] = new DragImage el:(@$ '.image-upload-1')
    @dragImages[2] = new DragImage el:(@$ '.image-upload-2')
    @dragImages[3] = new DragImage el:(@$ '.image-upload-3')


module.exports = Figure12Image