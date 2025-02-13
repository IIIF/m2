import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListSubheader from '@mui/material/ListSubheader';
import SingleIcon from '@mui/icons-material/CropOriginalSharp';
import ScrollViewIcon from '@mui/icons-material/ViewColumn';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import BookViewIcon from './icons/BookViewIcon';
import GalleryViewIcon from './icons/GalleryViewIcon';

const ViewOption = styled(MenuItem, { name: 'WindowViewSettings', slot: 'option' })(({ selected, theme }) => ({
  '& .MuiFormControlLabel-label': {
    borderBottom: '2px solid transparent',
    ...(selected && {
      borderBottomColor: theme.palette.secondary.main,
    }),
    '&.Mui-selected': {
      backgroundColor: 'transparent !important',
    },
    '&.Mui-selected.Mui-focusVisible': {
      backgroundColor: `${(theme.vars || theme).palette.action.focus} !important`,
    },
    '&:focused': {
      backgroundColor: `${(theme.vars || theme).palette.action.focus} !important`,
    },
    color: selected ? theme.palette.secondary.main : undefined,
    display: 'inline-block',
  },
}));

const StyledMenuList = styled(MenuList, { name: 'WindowViewSettings', slot: 'option' })(() => ({
  display: 'inline-flex',
}));

/**
 *
 */
export function WindowViewSettings({
  handleClose = () => {}, windowViewType, viewTypes = [], setWindowViewType, windowId,
}) {
  const { t } = useTranslation();
  /** */
  const handleChange = (value) => {
    setWindowViewType(windowId, value);
  };

  const iconMap = {
    book: BookViewIcon,
    gallery: GalleryViewIcon,
    scroll: ScrollViewIcon,
    single: SingleIcon,
  };

  /** Suspiciously similar to a component, yet if it is invoked through JSX
      none of the click handlers work? */
  const menuItem = ({ value, Icon }) => (
    <ViewOption
      aria-checked={windowViewType === value}
      autoFocus={windowViewType === value}
      key={value}
      onClick={() => { handleChange(value); handleClose(); }}
      role="menuitemradio"
      selected={windowViewType === value}
    >
      <FormControlLabel
        value={value}
        control={<Icon fill="currentcolor" color={windowViewType === value ? 'secondary' : undefined} />}
        label={t(value)}
        labelPlacement="bottom"
      />
    </ViewOption>
  );

  if (viewTypes.length === 0) return null;
  return (
    <>
      <ListSubheader role="presentation" disableSticky>{t('view')}</ListSubheader>
      <StyledMenuList role="menubar">
        { viewTypes.map(value => menuItem({ Icon: iconMap[value], value })) }
      </StyledMenuList>
    </>
  );
}

WindowViewSettings.propTypes = {
  handleClose: PropTypes.func,
  setWindowViewType: PropTypes.func.isRequired,
  viewTypes: PropTypes.arrayOf(PropTypes.string),
  windowId: PropTypes.string.isRequired,
  windowViewType: PropTypes.string.isRequired,
};
