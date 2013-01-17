Figure = require 'controllers/Figure'

{uniqueId} = require 'utils'

template = require 'templates'

class FigureSlider extends Figure

  bigSlider: yes

  canAddNewSlide: no

  elements:
    '.slider__next': 'nextButton'
    '.slider__prev': 'prevButton'
    '.slider__slides': 'slides'
    '.slider__info': 'info'
    '.slider__descr': 'descr'

    '.slider-builder': 'builder'
    '.slider-content': 'content'
    '.slider-builder .image-border .ul': 'builderList'

  events:
    'drop .slider__slides': 'drop'
    'click .manag-block-figure .image-move': -> @setSliderEdit yes
    'click .manag-block-figure .image-order': 'orderItems'
    'click .manag-block-figure .set-medium': ->
      @bigSlider = no
      @rebuildSlider()
    'click .manag-block-figure .set-large': ->
      @bigSlider = yes
      @rebuildSlider()

    'click .slider-builder .image-save': ->
      prevSlideId = null
      #@builderList.find('.li').each (idx, elem)=>
      for elem, idx in @builderList.find('.li')
        slideId = $(elem).data 'slide-id'
        if idx > 0
          @$("##{prevSlideId}").after (@$ "##{slideId}")
        else
          @slides.prepend (@$ "##{slideId}")

        prevSlideId = slideId

      @builder.hide()
      @content.show()
      @initSlider startSlideId: 0
      @setSliderEdit no


    'click .slider-builder .image-cancel': ->
      @builder.hide()
      @content.show()
      @setSliderEdit no


  constructor: ->
    @slidecache = {}
    super


  setSliderEdit: (edit)->
    edit = !!edit
    @canAddNewSlide = !edit
    @setDragImagesEditMode edit
    if edit
      @nextButton.hide()
      @prevButton.hide()
      @removeManagBlock()
    else
      @nextButton.show()
      @prevButton.show()
      blockSource = @createManagBlock().html template('figureslider_mangblock')
      @append blockSource


  addSlide: (image, isImageSrc = no)->
    slideId = uniqueId 'slide'
    tplName = if @bigSlider then 'figureslider_slidesource' else 'figureslider_slidesource_small'
    $slideSource = $(template(tplName, {slideId}))
    #sliderSource.css "height", @slides.height()+'px'

    @slides.append $slideSource

    $imageUpload = $slideSource.find '.image-upload'
    #console.log $imageUpload

    DragImage = require 'controllers/DragImage'
    cdi = @dragImages[slideId] = new DragImage el: $imageUpload, useManage: no
    #cdi.bind 'editmode', (editmode)=> @canAddNewSlide = !editmode
    if isImageSrc and image
      cdi.makeDragImage image
    else if image
      cdi.readImageFile image
    else
      cdi.bind 'imageUpdated', (ob)=> @addSlide() if ob.fisrtUpload
    cdi.bind 'save', => @setSliderEdit no
    cdi.bind 'cancel', => @setSliderEdit no

    @initSlider()


  initSlider: (options = {})->
    @slides.cycle 'destroy'
    @slides.cycle
      startingSlide: if options.startSlideId? then options.startSlideId else @currSlideId or 0
      fx: 'scrollHorz'
      speed: 'fast'
      timeout: 0
      next: @nextButton
      prev: @prevButton
      after: (curr, next, opts)=>
        @descr.html((opts.currSlide + 1) + " / " + opts.slideCount + "")
        @currSlideId = opts.currSlide
        #console.log _t.currSlideId
        #$ht = $(@).height()
        #$(this).parent().css("height", $ht+'px')


  init: ->
    @el.addClass('slider slider_wide no-edit').attr 'contenteditable', 'false'
    @html template('figureslider')
    @builder.hide()
    @slides.css height: '460px'
    @addSlide()
    @setSliderEdit no


  drop: (event)->
    return unless @canAddNewSlide
    event.preventDefault()
    (@addSlide im for im in event.originalEvent.dataTransfer.files) if event.originalEvent.dataTransfer
    yes

  orderItems: ->
    @content.hide()

    #console.log @getDragImagesSrc()
    @builderList.empty()
    #for slideId, ob of @dragImages when ob.imageSrc then do(slideId, imgSrc = ob.imageSrc)=>
    for slide in @slides.find('.slider__slide') then do(slide)=>
      $obSlide = $ slide
      slideId = $obSlide.attr 'id'
      ob = @dragImages[slideId]
      imgSrc = ob.imageSrc
      return unless imgSrc
      blId = uniqueId 'li-image-m'
      @builderList.append template('figureslider_order_item', {blId, slideId})
      img = new Image()
      img.src = imgSrc
      @$("##{blId} div").html img
      @$("##{blId} div img").css width: '116px', height: '83px'

    @builder.show()
    @builderList.sortable()
    @$('.slider-builder .image-border').append @createManagBlock().html template('figureslider_order_managblock')
    @refreshElements()

  rebuildSlider: ->
    imgSources = @getDragImagesSrc()

    @slides.empty()

    imgSources.map (src)=> @addSlide src, yes
    @addSlide()

    @initSlider startSlideId: 0
    @setSliderEdit no

    @refreshElements()



    
module.exports = FigureSlider