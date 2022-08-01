/** @jsxImportSource sigl */
import $ from 'sigl'

import { cheapRandomId, isEqual, omit } from 'everyday-utils'
import { Stretchy } from 'sigl-ui'
import { SortableElement, SortableState } from 'x-sortable'

import { fitGrid } from './fit-grid'

export { fitGrid }

const idToHsl = (id: string, saturation = 40, lightness = 50) =>
  `hsl(${(Math.round(parseInt(id, 36) / 25) * 25) % 360}, ${saturation}%, ${lightness}%)`

const unicode = (a: number, b: number) => String.fromCodePoint(Math.round(a + Math.random() * (b - a)))

// tribal / ancient
const pages = [
  [0x10a9, 0x10c5],
  [0x0250, 0x02af],
  [0x2d32, 0x2d66],
  [0x10280, 0x1029c],
  [0x102a0, 0x102d0],
  [0x1d200, 0x1d23c],
  [0x22c7, 0x22d7],
  [0x223b, 0x2253],
  [0x13a3, 0x13f3],
  [0x07c0, 0x07e7],
  [0x0531, 0x0556],
  [0x0561, 0x0587],
] as readonly [number, number][]

// emoji
// const pages = [
//   [0x1f300, 0x1f5ff],
//   [0x1f600, 0x1f64f],
//   [0x1f680, 0x1f6c5],
// ] as readonly [number, number][]

export const randomName = () => unicode(...pages[Math.random() * pages.length | 0])

export interface PresetElement<T extends object> extends $.Element<PresetElement<T>> {}

@$.element()
export class PresetElement<T extends object> extends HTMLElement {
  @$.attr.out() name = randomName()
  @$.attr.out() id = cheapRandomId()
  @$.attr() selected: boolean = $(this).fulfill(
    ({ $, presetsBar }) =>
      fulfill =>
        presetsBar.$.effect(({ selectedId }) => {
          fulfill(selectedId === $.id)
        }),
    false
  )

  @$.out() detail?: T
  isDraft = false

  vertical = false
  presetsBar?: PresetsBarElement<any>

  isDifferent: (detail: any) => boolean = $(this).reduce(({ $ }) =>
    (otherDetail: T) => $.detail ? !isEqual($.detail, otherDetail) : true
  )

  mounted($: PresetElement<T>['$']) {
    $.effect(({ host }) => {
      if (host.tabIndex === -1) host.tabIndex = 0
    })

    $.effect(({ host, id }) => {
      host.setAttribute('style', `--color: ${idToHsl(id, 85, 65)}`)
    })

    $.render(({ name }) => (
      <>
        <Stretchy part="name" width={42} height={26}>
          {name}
        </Stretchy>
        <span part="overlay"></span>
      </>
    ))
  }
}

export interface PresetsBarElement<T extends object> extends $.Element<PresetsBarElement<T>> {}

@$.element()
// https://github.com/typescript-eslint/typescript-eslint/issues/5317
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PresetsBarElement<T extends object> extends $.mix(HTMLElement, $.mixins.observed()) {
  Sortable = $.element(SortableElement)
  Preset = $.element(PresetElement)

  @$.attr() vertical = false
  columns = 1
  rows = 1

  @$.out() presets = new $.RefSet<PresetElement<T>>([])
  @$.out() selectedId: PresetElement<T>['id'] | false = false

  derivePreset = $(this).reduce(({ $, presets }) =>
    $.atomic((preset: Partial<PresetElement<T>>, detail: T | undefined = preset.detail) => {
      // if (!detail) {
      //   throw new Error('Attempt to derive preset that already lacks details.')
      // }

      const oldPresetData = omit(preset.toJSON?.() ?? preset, ['id'])
      const newPresetData = {
        ...oldPresetData,
        id: cheapRandomId(),
        detail,
        isDraft: true,
      }
      $.selectedId = newPresetData.id

      if (!presets.find(x => x.id === preset.id)) {
        presets.push(newPresetData)
      } else {
        presets.insertAfter(newPresetData, preset as PresetElement<T>)
      }
    })
  )

  selectedPreset: PresetElement<T> | undefined = $(this).reduce(({ presets, selectedId }) =>
    presets.find(x => x.id === selectedId)
  )

  updatePreset = $(this).reduce(
    ({ $, selectedPreset, derivePreset, findByDetail }) =>
      (detail: T) => {
        const preset = findByDetail(detail)
        if (preset) {
          if (preset.id !== selectedPreset.id) {
            $.mutate(() => {
              if (selectedPreset.isDraft) {
                $.presets.remove(selectedPreset)
              }
              $.selectedId = preset.id
            })
          }
          return
        }

        if (selectedPreset.isDifferent(detail)) {
          if (selectedPreset.isDraft || !selectedPreset.detail) {
            selectedPreset.detail = detail
          } else {
            derivePreset(selectedPreset, detail)
          }
        }
      },
    (detail: T) => {
      setTimeout(() => {
        if (
          this.selectedId
          && !this.presets.find(x => x.id === this.selectedId || isEqual(x.detail!, detail) || !x.detail)
        ) {
          // derive
          this.derivePreset({ name: randomName() }, detail)
        }
      }, 100)
    }
  )

  findByDetail: (detail: T) => PresetElement<T> | undefined = $(this).reduce(({ presets }) =>
    (detail: T) => presets.find(x => !x.isDifferent(detail))
  )

  // selectOrCreateByDetail: (detail: T) => void = $(this).reduce(({ $, presets, findByDetail }) =>
  //   $.queue.debounce(20)((detail: T) => {
  //     const preset = findByDetail(detail)
  //     if (preset) {
  //       $.selectedId = preset.id
  //     } else {
  //       const id = cheapRandomId()
  //       const newPresetData = {
  //         id,
  //         detail,
  //         isDraft: true,
  //       }
  //       $.mutate(() => {
  //         $.selectedId = id
  //         presets.push(newPresetData)
  //       })
  //     }
  //   })
  // )

  mounted($: PresetsBarElement<T>['$']) {
    $.effect(({ host }) => {
      if (host.tabIndex === -1) host.tabIndex = 0
    })

    $.effect(({ host, columns, rows }) => {
      host.style.setProperty('--cols', '' + columns)
      host.style.setProperty('--rows', '' + rows)
    })

    $.effect.debounce(100)(({ presets, selectedId }) => {
      if (!selectedId && presets.length) {
        $.selectedId = presets.items[0].id!
      }
    })

    // whenever a preset is changed, it's no longer a draft
    $.effect(({ selectedPreset }) =>
      () => {
        if (selectedPreset) {
          // if (findByDetail(selectedPreset.detail!) === selectedPreset) {
          selectedPreset.isDraft = false
          // }
        }
      }
    )

    $.effect(({ size, presets }) => {
      const [w, h] = size
      const total = presets.length
      const result = fitGrid(w, h, total)
      Object.assign($, result)
    })

    $.render(({ host, Sortable, Preset, presets }) => (
      <>
        <style>
          {$.css /*css*/`
          :host {
            --cols: 1;
            --rows: 1;
            width: 100%;
            height: 100%;

            ${Sortable} {
              width: 100%;
              height: 100%;
              display: flex;
              flex-wrap: wrap;
              flex-direction: row;
              /* resize: both; */
              overflow: hidden;

              /* display: flex; */
              user-select: none;
              touch-action: none;
              /* flex: 1; */
              /* background: #000; */
              z-index: 100;
              gap: 0px;
            }
          }

          ${Preset} {
            position: relative;
            display: inline-flex;
            width: calc(100% / var(--cols));
            height: calc(100% / var(--rows));

            --color: #aaa;
            --distance: 0;

            box-sizing: border-box;
            border: none;
            border-radius: 1px;

            /* opacity: 0.75; */
            color: var(--color);
            /* background: #000; */

            font-family: Helvetica, 'Helvetica Neue', 'Open Sans', Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
            font-size: 22px;
            text-align: center;

            &::part(name) {
              display: flex;
              z-index: 1;
              width: 100%;
              height: 100%;
            }

            &::part(overlay) {
              z-index: 0;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;

              opacity: var(--distance);
              background: var(--color);

              /* transition: opacity 0.068s ease-in; */
            }

            /* &:hover,
            &[selected] {
              &::part(name) {
                color: black;
              }
              &::part(overlay) {
                opacity: 1;
              }
            } */
          }

          ${Sortable} {
            &:not([state=${SortableState.Sort}]) {
              ${Preset} {
                &:hover,
                &[selected] {
                  &::part(name) {
                    color: black;
                  }
                  &::part(overlay) {
                    opacity: 1;
                  }
                }
              }
            }
          }

          ${Sortable} {
            &[state=${SortableState.Sort}] {
              ${Preset} {
                &[selected] {
                  &::part(name) {
                    color: black;
                  }
                  &::part(overlay) {
                    opacity: 1;
                  }
                }
              }
            }
          }

          :host(:not([vertical])) {
            ${Sortable} {
            }

            ${Preset} {
            }
          }

          :host([vertical]) {
            ${Sortable} {
              flex-direction: column;
            }

            ${Preset} {
            }
          }
        `('')}
        </style>

        <Sortable
          onsortend={({ detail: { oldIndex, newIndex } }) => {
            presets.move(oldIndex, newIndex)
          }}
        >
          {presets.map(preset => (
            <Preset
              key={preset.id}
              {...preset}
              presetsBar={host}
              onpointerdown={e => {
                if (e.buttons & $.MouseButton.Left) {
                  $.selectedId = preset.ref.current!.id
                }
              }}
              onkeydown={e => {
                if (e.key === 'Enter') {
                  $.selectedId = preset.ref.current!.id
                }
              }}
            />
          ))}
        </Sortable>
      </>
    ))
  }
}
