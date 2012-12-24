
{uniqueId} = require 'utils'

forFiguresBind =
  image_single:
    idPrefix: 'image_single'
    tpl: """<div id="##id##"></div>"""
    controller: 'controllers/FigureSingleImage'

  image_12:
    idPrefix: 'image_12'
    tpl: """<figure id="##id##"></figure>"""
    controller: 'controllers/Figure12Image'

  image_slider:
    idPrefix: 'image_slider'
    tpl: """<div id="##id##"></div>"""
    controller: 'controllers/FigureSlider'

  image_11:
    idPrefix: 'image_11'
    tpl: """<figure id="##id##"></figure>"""
    controller: 'controllers/Figure11Image'

  image_31:
    idPrefix: 'image_31'
    tpl: """<figure id="##id##"></figure>"""
    controller: 'controllers/Figure31Image'

forCommandsBind =
  'bold': {cmd: 'bold'}
  'italic': {cmd: 'italic'}
  'listnum': {cmd: 'insertOrderedList'}
  'list': {cmd: 'insertUnorderedList'}
  #'h2': {cmd: 'formatblock', params: 'div'}


editorOnChange = (event)-> @onChange event

class Editor extends Spine.Controller
  events:
    #blur: editorOnChange
    keyup: editorOnChange
    paste: editorOnChange
    click: editorOnChange

  constructor: ->
    super
    @figures = {}
    @panel.bind 'execCommand', (args...)=> @execCommand args...
    @panel.bind 'insertFigure', (figureName)=> @insertFigure forFiguresBind[figureName]

  execCommand: (cmd, params)->
    @restoreCursorPositon()
    switch cmd
      when 'h2'
        h2DivId = uniqueId 'h2_compose__pretext'
        h2Div = document.createElement 'div'
        h2Div.id = h2DivId
        h2Div.className = 'compose__pretext'
        @range.surroundContents h2Div
        (@$ '#'+h2DivId).css width: '640px', margin: 'auto'
      when 'link'
        document.execCommand 'createLink', no, params
      else
        if command = forCommandsBind[cmd]
          document.execCommand command.cmd, no, params or command.params or null

  insertFigure: (options)->
    @restoreCursorPositon()
    figureId = uniqueId options.idPrefix
    node = @range.createContextualFragment "<div>"+(options.tpl.replace '##id##', figureId)+"</div><div>&nbsp;</div>"
    @range.insertNode node
    Obj = require options.controller
    @figures[figureId] = new Obj el: @$ '#'+figureId

  onChange: (event)->
    if $(event.srcElement).parents('.no-edit').length < 1
      selection = window.getSelection()
      @range = selection.getRangeAt 0

  restoreCursorPositon: ->
    @el.focus()
    unless @range
      @range = document.createRange()
      @range.selectNodeContents @el.get 0
      @range.collapse no
    selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange @range


module.exports = Editor