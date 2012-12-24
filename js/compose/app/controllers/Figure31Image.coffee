Figure = require 'controllers/Figure'

class Figure31Image extends Figure
  constructor: ->
    super


  init: ->
    @el.addClass('figure_many figure_wide no-edit').attr 'contenteditable', 'false'
    @html """<div class="image-border">
          <div class="image-upload image-container image-upload-1" style="height:550px; width:334px;"></div>
          <div class="image-upload image-container image-upload-2" style="height:550px; width:333px;"></div>
          <div class="image-upload image-container image-upload-3" style="height:550px; width:333px;"></div>
          </div>"""
    DragImage = require 'controllers/DragImage'
    @dragImages[1] = new DragImage el: @$('.image-upload-1'), noManage: no
    @dragImages[2] = new DragImage el: @$('.image-upload-2'), noManage: no
    @dragImages[3] = new DragImage el: @$('.image-upload-3'), noManage: no

    
module.exports = Figure31Image