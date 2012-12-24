Figure = require 'controllers/Figure'

{uniqueId} = require 'utils'

class FigureSlider extends Figure

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
    'click .manag-block-figure .image-order': ->
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
        @builderList.append """<div class="image-m li" style="width: 116px; height: 83px;" id="#{blId}" data-slide-id="#{slideId}">
          <div></div>
          <span>&nbsp;</span>
          </div>"""
        img = new Image()
        img.src = imgSrc
        @$("##{blId} div").html img
        @$("##{blId} div img").css width: '116px', height: '83px'

      @builder.show()
      @builderList.sortable()
      @$('.slider-builder .image-border').append @createManagBlock().html """<div class="image-manag image-cancel">Cancel</div>
                               <div class="image-manag image-save">Save</div>"""
      @refreshElements()

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
        yes


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
    @setDragImagesEditMode edit
    if edit
      @nextButton.hide()
      @prevButton.hide()
      @removeManagBlock()
    else
      @nextButton.show()
      @prevButton.show()
      blockSource = @createManagBlock().html """<div class="image-manag">
                                             <div><span class="image-remove"></span></div>
                                             <div><span class="image-order"></span></div>
                                             <div><span class="image-move"></span></div>
                                             </div>
                                             <div class="image-manag">
                                             <div><span class="image-size-m"></span></div>
                                             <div><span class="image-size-l"></span></div>
                                             </div>"""
      @append blockSource


  addSlide: (image, dragImageOptions = {})->
    slideId = uniqueId 'slide'
    $sliderSource = $ """<div class="slider__slide" id="#{slideId}">
                     <div class="image-upload" style="width: 1000px; height: 456px;"></div>
                     </div>"""
    #sliderSource.css "height", @slides.height()+'px'

    @slides.append $sliderSource

    $imageUpload = $sliderSource.find '.image-upload'
    #console.log $imageUpload

    dragImageOptions.el = $imageUpload
    DragImage = require 'controllers/DragImage'
    cdi = @dragImages[slideId] = new DragImage dragImageOptions
    cdi.readImageFile image if image
    #cdi.bind 'editmode', (editmode)=> @canAddNewSlide = !editmode
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
    @html """<div class="slider-content">
      <div class="slider__next"><span></span></div>
      <div class="slider__prev"><span></span></div>
      <div class="slider__slides"></div>
      <div class="slider__info"></div>
      <div class="slider__descr"></div>
      </div>

      <div class="slider-builder">
      <div class="image-border"><div class="ul"></div></div>
      </div>"""
    @builder.hide()
    @slides.css height: '456px'
    @addSlide()
    @setSliderEdit no


  drop: (event)->
    return unless @canAddNewSlide
    event.preventDefault()
    @addSlide event.originalEvent.dataTransfer?.files[0]

    
module.exports = FigureSlider