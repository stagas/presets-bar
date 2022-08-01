<h1>
presets-bar <a href="https://npmjs.org/package/presets-bar"><img src="https://img.shields.io/badge/npm-v1.0.0-F00.svg?colorA=000"/></a> <a href="src"><img src="https://img.shields.io/badge/loc-386-FFF.svg?colorA=000"/></a> <a href="https://cdn.jsdelivr.net/npm/presets-bar@1.0.0/dist/presets-bar.min.js"><img src="https://img.shields.io/badge/brotli-18.9K-333.svg?colorA=000"/></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-F0B.svg?colorA=000"/></a>
</h1>

<p></p>

Presets bar Web Component.

<h4>
<table><tr><td title="Triple click to select and copy paste">
<code>npm i presets-bar </code>
</td><td title="Triple click to select and copy paste">
<code>pnpm add presets-bar </code>
</td><td title="Triple click to select and copy paste">
<code>yarn add presets-bar</code>
</td></tr></table>
</h4>

## Examples

<details id="example$web" title="web" open><summary><span><a href="#example$web">#</a></span>  <code><strong>web</strong></code></summary>  <ul>    <details id="source$web" title="web source code" ><summary><span><a href="#source$web">#</a></span>  <code><strong>view source</strong></code></summary>  <a href="example/web.tsx">example/web.tsx</a>  <p>

```tsx
/** @jsxImportSource sigl */
import $ from 'sigl'

import { cheapRandomId } from 'everyday-utils'
import { PresetElement, PresetsBarElement, randomName } from 'presets-bar'

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
```

</p>
</details></ul></details>

## API

## Credits

- [everyday-utils](https://npmjs.org/package/everyday-utils) by [stagas](https://github.com/stagas) &ndash; Everyday utilities
- [rfdc](https://npmjs.org/package/rfdc) by [David Mark Clements](https://github.com/davidmarkclements) &ndash; Really Fast Deep Clone
- [sigl](https://npmjs.org/package/sigl) by [stagas](https://github.com/stagas) &ndash; Web framework
- [sigl-ui](https://npmjs.org/package/sigl-ui) by [stagas](https://github.com/stagas) &ndash; UI elements and components for sigl
- [x-sortable](https://npmjs.org/package/x-sortable) by [stagas](https://github.com/stagas) &ndash; Sortable Web Component

## Contributing

[Fork](https://github.com/stagas/presets-bar/fork) or [edit](https://github.dev/stagas/presets-bar) and submit a PR.

All contributions are welcome!

## License

<a href="LICENSE">MIT</a> &copy; 2022 [stagas](https://github.com/stagas)
