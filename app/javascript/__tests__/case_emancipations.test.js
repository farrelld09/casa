/* eslint-env jest */
import { openChildren, closeChildren, deselectChildren, manageTogglerText } from '../src/case_emancipation'

require('jest')

let category
let categoryCollapseIcon
let categoryOptionsContainer
let checkBox

beforeEach(() => {
  document.body.innerHTML = `
  <div class="card card-container">
    <div class="card-body">
        <div>
          <h6 class="emancipation-category no-select" data-is-open='false'>
            <input type="checkbox" class="emancipation-category-check-box" value="1">
            <label>Youth has housing.</label>
              <span class="category-collapse-icon">+</span>
          </h6>
          <div
            class="category-options"
            style="display: none;">
              <div class="check-item">
                <input type="checkbox" id="O1" class="emancipation-option-check-box" value="1" checked>
                <label>With Friend</label>
              </div>
          </div>
        </div>
    </div>
  </div>
  `

  category = $('.emancipation-category')
  categoryCollapseIcon = $('.category-collapse-icon')
  categoryOptionsContainer = $('.category-options')
  checkBox = $('.emancipation-option-check-box')
})

describe('Function that changes the text of the Toggler based on the state of the parent', () => {
  test('Changes the toggler text to -', () => {
      category.attr('data-is-open', 'false')

      manageTogglerText(category)
      expect(categoryCollapseIcon.text()).toEqual('+')
  })
})

describe('Function that opens the children of a given parent', () => {
  test('Opens the categoryOptionsContainer', () => {
      openChildren(category)
      expect(category.data('is-open')).toEqual(true)
    })
})

describe('Function that closes the children of a given parent', () => {
  test('Closes the categoryOptionsContainer', () => {
      closeChildren(category)
      expect(category.data('is-open')).toEqual(false)
    })
})

describe('Function that deselects the children of a deselected parent', () => {
  test('Deselects the inputs in the categoryOptionsContainer', () => {
      deselectChildren(category)
      expect(checkBox).is('checked').toEqual(false)
      // expect(checkBox.hasAttribute('checked')).toBe(false)
      // expect(checkBox.prop('checked')).toBe(false)
    })
})
