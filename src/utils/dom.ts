export const selectText = (element: HTMLElement) => {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(element);
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

export const unselectText = () => {
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
  }
};
