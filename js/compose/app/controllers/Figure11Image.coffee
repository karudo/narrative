Figure = require 'controllers/Figure'


class Figure11Image extends Figure
  constructor: ->
    super

  init: ->
    @el.addClass('figure_many figure_wide no-edit').attr 'contenteditable', 'false'
    @html require('templates')('figure11')
    DragImage = require 'controllers/DragImage'
    @dragImages[1] = new DragImage el: @$('.image-upload-1')
    @dragImages[2] = new DragImage el: @$('.image-upload-2')

    
module.exports = Figure11Image