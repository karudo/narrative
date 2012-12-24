
eventsMapCommands =
  '.wyswyg__bold': 'bold'
  '.wyswyg__italic': 'italic'
  '.wyswyg__listnum': 'listnum'
  '.wyswyg__list': 'list'
  '.wyswyg__h2': 'h2'

eventsMapFigures =
  '.photo_1': 'image_single'
  '.photo_12': 'image_12'
  '.photo_11': 'image_11'
  '.photo_31': 'image_31'
  '.photo_g': 'image_slider'


class Panel extends Spine.Controller


  events:
    'submit .wyswyg__link form': 'insertLink'


  constructor: ->
    @_cloneEvents()

    for cl, command of eventsMapCommands
      @events['click '+cl] = do(command)=>
        (event)=>
          event.preventDefault()
          event.stopPropagation()
          @execCommand command

    for cl, evName of eventsMapFigures
      @events["click #{cl}_handler"] = do(evName)=> (event)=>
        console.log evName
        event.preventDefault()
        event.stopPropagation()
        @trigger 'insertFigure', evName

    super




  execCommand: -> @trigger 'execCommand', arguments...


  insertLink: (event)->
    event.preventDefault()
    event.stopPropagation()
    val = (@$ '.wyswyg__link .input').val()
    @execCommand 'link', val
    (@$ '.wyswyg__link .wyswyg__drop').fadeOut()
    (@$ '.wyswyg__link .input').val('http://')
    #no

  _cloneEvents: ->
    @events = do (events = @events)->
      result = {}
      for ev, func of events
        result[ev] = func
      result

module.exports = Panel
