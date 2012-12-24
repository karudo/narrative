{doSeveralTimes} = require 'utils'

class DragImage extends Spine.Controller

  editMode: yes

  hasImage: no

  savedSliderValue: 0
  savedImageTop: 0
  savedImageLeft: 0

  fisrtUpload: yes

  noManage: yes

  elements:
    'img': 'image'
    '.imageDrag': 'dragdiv'
    '.manag-block': 'managBlock'
    '.image-upload_file': 'uploadFile'

  events:
    'click .manag-block .image-save': 'clickSave'

    'click .manag-block .image-cancel': 'clickCancel'

    'click .manag-block .image-remove': 'makeEmpty'
    'click .manag-block .image-move': ->
      @createManagSliderBlock()
      @setEditMode yes

    'click .image-upload__icon': ->
      return unless @editMode
      @uploadFile.click()

    'change .image-upload_file': 'userSelectFile'

    drop: 'drop'

    dragover: (event)->
      return unless @editMode
      event.preventDefault()
      if @dragUploadedImage
        @cursorInArea = yes
      else
        @setDragOver()

    dragleave: (event)->
      return unless @editMode
      event.preventDefault()
      if @dragUploadedImage
        @cursorInArea = no
      else
        @setDragLeave()

    'dragstart .imageDrag': 'dragstart'

    'dragend .imageDrag': ->
      return unless @editMode
      @dragUploadedImage = no

    'drag .imageDrag': 'drag'


  constructor: ->
    super


  init: ->
    @makeEmpty()


  makeEmpty: ->
    @savedSliderValue = 0
    @savedImageTop = 0
    @savedImageLeft = 0
    @removeManagBlock()
    @html """<div class="image-upload__in">
      <div class="image-upload__icon"></div>
      <input type="file" class="image-upload_file" accept="image/*">
      <div class="image-upload__text">Click or drug’n’drop to upload header image</div>
      </div>"""
    @editMode = yes
    @hasImage = no


  makeDragImage: (imageSrc)->

    image = new Image()
    image.src = imageSrc

    @imgOrigWidth = @imgOrigHeight = 0

    @$el.empty()

    $draggableDiv = $ '<div class="imageDrag"></div>'
    $draggableDiv.html image

    doSeveralTimes =>
      if image.height > 0 or image.width > 0
        @imgOrigWidth = image.width
        @imgOrigHeight = image.height
        $draggableDiv.append '<div class="topOfImage"></div>'
        $draggableDiv.find('.topOfImage').css
          width: @imgOrigWidth+'px'
          height: @imgOrigHeight+'px'
        yes
      else
        no
    , =>
      @imageSrc = imageSrc
      @html $draggableDiv
      @createManagSliderBlock()
      @setEditMode yes
      @hasImage = yes
      @trigger 'imageUpdated',
        fisrtUpload: @fisrtUpload
        width: @imgOrigWidth
        height: @imgOrigHeight
      @fisrtUpload = no if @fisrtUpload


  readImageFile: (imgFile)->
    if imgFile
      reader = new FileReader()
      reader.onload = (frEvent)=> @makeDragImage frEvent.target.result
      reader.readAsDataURL imgFile


  createManagBlock: (remove = yes)->
    @removeManagBlock() if remove
    $ """<div class="manag-block"></div>"""


  removeManagBlock: ->
    @slider.release() if @slider
    @managBlock.remove()


  createManagSliderBlock: ->
    blockSource = @createManagBlock().html """<div class="image-manag"></div>
      <div class="image-manag image-cancel">Cancel</div>
      <div class="image-manag image-save">Save</div>"""
    UISlider = require 'controllers/UISlider'
    @slider = new UISlider el: blockSource.find('.image-manag').first()
    @slider.bind 'value', (value)=>
      @imgOrigHeight = @image.height() unless @imgOrigHeight
      nv = @imgOrigHeight / @slider.maxValue * value
      @image.css height: nv+'px' if nv
    @slider.setValue @savedSliderValue
    @append blockSource


  createManagEditBlock: ->
    blockSource = @createManagBlock().html """<div class="image-manag">
        <div><span class="image-remove"></span></div>
        <div><span class="image-move"></span></div>
      </div>"""
    @append blockSource


  setDragOver: -> @$el.addClass 'dragover' unless @$el.hasClass 'dragover'
  setDragLeave: -> @$el.removeClass 'dragover'


  setEditMode: (b)->
    @editMode = !!b
    if @editMode
      (@$ '.imageDrag').addClass('edit').attr 'draggable', 'true'
      @createManagSliderBlock()
    else
      (@$ '.imageDrag').removeClass('edit').attr 'draggable', 'false'
      @removeManagBlock()
    @trigger 'editmode', @editMode


  userSelectFile: -> if @uploadFile[0] then @readImageFile @uploadFile.get(0).files.item?(0)


  dragstart: (event)->
    return unless @editMode
    originalEvent = event.originalEvent
    dataTransfer = originalEvent.dataTransfer

    unless @dragImage
      @dragImage = document.createElement 'span'
      #@dragImage.src = '/img/1x1.gif'

    dataTransfer.setData 'Text', ''
    dataTransfer.setDragImage @dragImage, 1, 1 if dataTransfer.setDragImage

    @startDragX = originalEvent.pageX
    @startDragY = originalEvent.pageY

    @startPositionCoords = @dragdiv.position()
    @dragUploadedImage = yes


  drag: (event)->
    return unless @editMode
    event.preventDefault()
    if @cursorInArea
      @dragdiv.css
        left: @startPositionCoords.left+(event.originalEvent.pageX - @startDragX)+'px'
        top: @startPositionCoords.top+(event.originalEvent.pageY - @startDragY)+'px'


  drop: (event)->
    return unless @editMode
    event.preventDefault()
    @readImageFile event.originalEvent.dataTransfer?.files[0]
    @setDragLeave()


  clickSave: ->
    @savedSliderValue = @slider.getValue()
    pos = @dragdiv.position()
    @savedImageTop = pos.top
    @savedImageLeft = pos.left
    @setEditMode no
    if @noManage then @removeManagBlock() else @createManagEditBlock()
    @trigger 'save'


  clickCancel: ->
    if @hasImage
      @slider?.setValue? @savedSliderValue
      @dragdiv.css
        left: @savedImageLeft
        top: @savedImageTop
      if @noManage then @removeManagBlock() else @createManagEditBlock()
    else
      @makeEmpty()
    @setEditMode no
    @trigger 'cancel'

module.exports = DragImage