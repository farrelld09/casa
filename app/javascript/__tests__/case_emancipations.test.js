/* eslint-env jest */
import { openChildren, closeChildren, deselectChildren, manageTogglerText } from "../src/case_emancipation";

require('jest')

let category
let categoryCollapseIcon
let categoryOptionsContainer

// how do I set this up?
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
                <input type="checkbox" id="O1" class="emancipation-option-check-box" value="1">
              <label>With Friend</label>
              </div>
          </div>
        </div>
    </div>
  </div>
  `

  category = document.querySelector('.emancipation-category')
  categoryCollapseIcon = document.querySelector('.category-collapse-icon')
  categoryOptionsContainer = document.querySelector('.category-options')
})

describe('Function that changes the text of the Toggler based on the state of the parent', () => {
  test('Changes the toggler text to -', () => {
    $(document).ready(() => {
      category.attr('data-is-open', 'false')

      manageTogglerText(category)
      expect(categoryCollapseIcon.text).toContain('+')
    })
  })
})

describe('Function that opens the children of a given parent', () => {
  test('Opens the categoryOptionsContainer', () => {
    $(document).ready(() => {
      openChildren(category)
      expect(category.attr('data-is-open')).toContain('true')
    })
  })
})

describe('Function that closes the children of a given parent', () => {
  test('Closes the categoryOptionsContainer', () => {
    $(document).ready(() => {
      closeChildren(category)
      expect(category.attr('data-is-open')).toContain('false')
    })
  })
})

describe('Function that deselects the children of a deselected parent', () => {
  test('Deselects the inputs in the categoryOptionsContainer', () => {
    $(document).ready(() => {
      deselectChildren(category)
      expect(category.attr('data-is-open')).toContain('true')
    })
  })
})
