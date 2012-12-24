Spine = @Spine or require('spine')

Spine.Model.Local =
  extended: ->
    @change @saveOS
    @fetch @loadOS

  saveOS: ->
    result = JSON.stringify(@)
    localStorage[@className] = result

  loadOS: ->
    result = localStorage[@className]
    @refresh(result or [], clear: true)

module?.exports = Spine.Model.Local