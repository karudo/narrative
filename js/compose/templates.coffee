tpl = {}

tpl['di_emptyblock'] = """<div class="image-upload__in">
                       <div class="image-upload__icon"></div>
                       <input type="file" class="image-upload_file" accept="image/*">
                       <div class="image-upload__text">Click or drug’n’drop to upload header image</div>
                       </div>"""

tpl['di_sliderblock'] = """<div class="image-manag"></div>
                       <div class="image-manag image-cancel">Cancel</div>
                       <div class="image-manag image-save">Save</div>"""

tpl['di_editblock'] = """<div class="image-manag">
                      <div><span class="image-remove"></span></div>
                      <div><span class="image-move"></span></div>
                      </div>"""

tpl['figure11'] = """<div class="image-border">
                  <div class="image-upload image-container image-upload-1" style="height:550px; width:500px;"></div>
                  <div class="image-upload image-container image-upload-2" style="height:550px; width:500px;"></div>
                  </div>"""

tpl['figure12'] = """<div class="image-border">
                  <div class="image-upload image-container image-upload-1" style="height:500px; width:500px;"></div>
                  <div class="image-container">
                  <div class="image-upload image-container image-upload-2" style="height:250px; width:500px;"></div>
                  </div>
                  <div class="image-container">
                  <div class="image-upload image-container image-upload-3" style="height:250px; width:500px;"></div>
                  </div>
                  </div>"""

tpl['figure31'] =  """<div class="image-border">
                     <div class="image-upload image-container image-upload-1" style="height:550px; width:334px;"></div>
                     <div class="image-upload image-container image-upload-2" style="height:550px; width:333px;"></div>
                     <div class="image-upload image-container image-upload-3" style="height:550px; width:333px;"></div>
                     </div>"""

tpl['figuresingle'] = """<div class="image-border">
                      <div class="image-upload image-container" style="height:456px; width:640px;"></div>
                      </div>"""

tpl['figureslider'] = """<div class="slider-content">
                      <div class="slider__next"><span></span></div>
                      <div class="slider__prev"><span></span></div>
                      <div class="slider__slides"></div>
                      <div class="slider__info"></div>
                      <div class="slider__descr"></div>
                      </div>

                      <div class="slider-builder">
                      <div class="image-border"><div class="ul"></div></div>
                      </div>"""

tpl['figureslider_mangblock'] = """<div class="image-manag">
                                <div><span class="image-remove"></span></div>
                                <div><span class="image-order"></span></div>
                                <div><span class="image-move"></span></div>
                                </div>
                                <div class="image-manag">
                                <div><span class="image-size-m"></span></div>
                                <div><span class="image-size-l"></span></div>
                                </div>"""

tpl['figureslider_slidesource'] = """<div class="slider__slide" id="#slideId#">
                                  <div class="image-upload" style="width: 1000px; height: 456px;"></div>
                                  </div>"""

tpl['figureslider_order_item'] = """<div class="image-m li" style="width: 116px; height: 83px;" id="#blId#" data-slide-id="#slideId#">
                                 <div></div>
                                 <span>&nbsp;</span>
                                 </div>"""

tpl['figureslider_order_managblock'] = """<div class="image-manag image-cancel">Cancel</div>
                                       <div class="image-manag image-save">Save</div>"""

module.exports = (name, vars = {})->
  t = tpl[name]
  t = t.replace "##{k}#", v for k, v of vars
  t