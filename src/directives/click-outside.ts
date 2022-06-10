import type { DirectiveBinding } from 'vue';

export type ModifiedElement = Element & { _clickOutside?: (e: Event) => void };

const defaultConditional = () => true;

const directive = (e: Event, el: Element, binding: DirectiveBinding) => {
  const handler =
    typeof binding.value === 'function' ? binding.value : binding.value.handler;

  const isActive =
    (typeof binding.value === 'object' && binding.value.conditional) ||
    defaultConditional;

  // The include element callbacks below can be expensive
  // so we should avoid calling them when we're not active.
  // Explicitly check for false to allow fallback compatibility
  // with non-toggleable components
  if (!e || isActive(e) === false) return;

  // Check if additional elements were passed to be included in check
  // (click must be outside all included elements, if any)
  const elements = (
    (typeof binding.value === 'object' && binding.value.include) ||
    (() => [])
  )();
  // Add the root element for the component this directive was defined on
  elements.push(el);

  // Check if it's a click outside our elements, and then if our callback returns true.
  // Non-toggleable components should take action in their callback and return falsy.
  // Toggleable can return true if it wants to deactivate.
  // Note that, because we're in the capture phase, this callback will occur before
  // the bubbling click event on any outside elements.
  !elements.some((el: Element) => el.contains(e.target as Element)) &&
    setTimeout(() => {
      isActive(e) && handler && handler(e);
    }, 0);
};

export const clickOutside = {
  mounted(el: ModifiedElement, binding: DirectiveBinding) {
    console.log('inserted'); // eslint-disable-line
    const onClick = (e: Event) => directive(e, el, binding);
    document.body.addEventListener('click', onClick, true);
    el._clickOutside = onClick;
  },

  unmounted(el: ModifiedElement) {
    console.log('unbind'); // eslint-disable-line
    if (!el._clickOutside) return;

    document.body.removeEventListener('click', el._clickOutside, true);
    delete el._clickOutside;
  },
};

export default clickOutside;
