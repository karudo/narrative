
class Figure extends Spine.Controller
  #elements:
  #  '.manag-block-figure': 'managBlock'


  constructor: ->
    @dragImages = {}
    @elements or= {}
    @elements['.manag-block-figure'] = 'managBlock' unless @elements?['.manag-block-figure']
    super


  getDragImagesSrc: -> ob.imageSrc for k, ob of @dragImages when ob.imageSrc


  setDragImagesEditMode: (editMode)->
    ob.setEditMode editMode for k, ob of @dragImages
    @


  createManagBlock: (remove = yes)->
    @removeManagBlock() if remove
    $ """<div class="manag-block manag-block-figure"></div>"""


  removeManagBlock: ->
    @managBlock.remove() if @managBlock

    
module.exports = Figure