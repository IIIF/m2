import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import ExpandLess from '@mui/icons-material/ExpandLessSharp';
import ExpandMore from '@mui/icons-material/ExpandMoreSharp';

/**
 * NestedMenu ~ A presentation component to render a menu item and have
 * it control the visibility of the MUI List passed in as the children
*/
export function NestedMenu({
  children, icon = null, label, ...otherProps
}) {
  const [nestedMenuIsOpen, setNestedMenuIsOpen] = useState(false);

  const handleMenuClick = useCallback(() => {
    setNestedMenuIsOpen(!nestedMenuIsOpen);
  }, [nestedMenuIsOpen, setNestedMenuIsOpen]);

  return (
    <>
      <MenuItem onClick={handleMenuClick} divider={nestedMenuIsOpen} {...otherProps}>
        {icon && (<ListItemIcon>{icon}</ListItemIcon>)}
        <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
          {label}
        </ListItemText>
        {
          nestedMenuIsOpen
            ? <ExpandLess />
            : <ExpandMore />
        }
      </MenuItem>
      {nestedMenuIsOpen && children}
    </>
  );
}

NestedMenu.propTypes = {
  children: PropTypes.element.isRequired,
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
};
