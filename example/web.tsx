/** @jsxImportSource sigl */
import $ from 'sigl'

import { cheapRandomId } from 'everyday-utils'
import { PresetElement, PresetsBarElement, randomName } from '../src'

type PresetDetail = {
  whatever: string
}

interface PresetsContainerElement extends $.Element<PresetsContainerElement> {}
@$.element()
class PresetsContainerElement extends HTMLElement {
  PresetsBar = $.element(PresetsBarElement<PresetDetail>)
  presets = new $.RefSet<PresetElement<PresetDetail>>([
    { name: randomName(), id: cheapRandomId() },
    { name: randomName(), id: cheapRandomId() },
    { name: randomName(), id: cheapRandomId() },
    { name: randomName(), id: cheapRandomId() },
    { name: randomName(), id: cheapRandomId() },
    { name: randomName(), id: cheapRandomId() },
    { name: randomName(), id: cheapRandomId() },
    { name: randomName(), id: cheapRandomId() },
    { name: randomName(), id: cheapRandomId() },
    { name: randomName(), id: cheapRandomId() },
  ])

  mounted($: PresetsContainerElement['$']) {
    $.render(({ PresetsBar, presets }) => <PresetsBar presets={presets} />)
  }
}

const PresetsContainer = $.element(PresetsContainerElement)

$.render(
  <PresetsContainer style="width=300px;height:400px;resize:both;overflow:hidden;display:inline-flex" />,
  document.body
)

// console.log(JSON.stringify(document.body.querySelector('' + PresetsBar)))
