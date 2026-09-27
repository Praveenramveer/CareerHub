import React from "react";

/**
 * Creates an onKeyDown event handler that triggers the provided callback
 * when the user presses 'Enter' or 'Space' (' ').
 * It prevents the default browser behavior (such as spacebar scrolling the page).
 */
export const onKeyEnterOrSpace = (
  callback: (e: React.KeyboardEvent | React.MouseEvent) => void
) => {
  return (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      callback(e);
    }
  };
};

/**
 * Returns accessible keyboard attributes for non-button interactive elements (links, custom tabs, cards).
 */
export const getAccessibleButtonProps = (
  onClick: (e: React.KeyboardEvent | React.MouseEvent) => void,
  ariaLabel?: string
) => {
  return {
    role: "button" as const,
    tabIndex: 0,
    "aria-label": ariaLabel,
    onKeyDown: onKeyEnterOrSpace(onClick),
  };
};

/**
 * Returns accessible tab attributes for navigation tabs and segment switchers.
 */
export const getAccessibleTabProps = (
  isSelected: boolean,
  onSelect: (e: React.KeyboardEvent | React.MouseEvent) => void,
  label?: string
) => {
  return {
    role: "tab" as const,
    "aria-selected": isSelected,
    tabIndex: isSelected ? 0 : -1,
    "aria-label": label,
    onKeyDown: onKeyEnterOrSpace(onSelect),
  };
};
