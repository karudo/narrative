Spine = require('spine')

class UISlider extends Spine.Controller
  maxValue: 20

  elements:
    '.idslider': 'slider'

  events:
    'click .slider-m': 'clickMinus'
    'click .slider-p': 'clickPlus'

  constructor: ->
    super
    @html """<span class="slider-m"></span><div class="idslider"></div><span class="slider-p"></span>"""
    @slider.slider
      min: 1
      max: @maxValue
      value: @maxValue
      change: => @trigger 'value', @slider.slider 'value'

  setValue: (value)-> @slider.slider 'value', value or @maxValue
  getValue: -> @slider.slider 'value'

  clickMinus: ->
    val = @slider.slider 'value'
    if val > 1
      val -= 1
      @slider.slider 'value', val
      @trigger 'value', val

  clickPlus: ->
    val = @slider.slider 'value'
    if val < @maxValue
      val += 1
      @slider.slider 'value', val
      @trigger 'value', val

  _release: ->
    @slider.slider 'destroy'
    super

module.exports = UISlider