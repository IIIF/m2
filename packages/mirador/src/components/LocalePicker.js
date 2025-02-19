import PropTypes from 'prop-types';
import keyBy from 'lodash/keyBy';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getLanguagesFromConfigWithCurrent } from '../state/selectors/config';

/**
 * Provide a locale picker
 */
export function LocalePicker({ availableLocales = [], locale = '', setLocale = undefined }) {
  const languages = useSelector(state => getLanguagesFromConfigWithCurrent(state));
  const { t } = useTranslation();

  if (!setLocale || availableLocales.length < 2) return null;

  const selectedLocale = availableLocales.indexOf(locale) >= 0 ? locale : availableLocales[0];
  const labels = keyBy(languages, o => o.locale);

  return (
    <FormControl variant="standard">
      <InputLabel>{t('language')}</InputLabel>
      <Select
        MenuProps={{
          anchorOrigin: {
            horizontal: 'left',
            vertical: 'bottom',
          },
        }}
        autoWidth
        displayEmpty
        value={selectedLocale}
        onChange={(e) => { setLocale(e.target.value); }}
        name="locale"
      >
        {
          availableLocales.map(l => (
            <MenuItem key={l} value={l}><Typography variant="body2">{ labels[l]?.label || l }</Typography></MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
}

LocalePicker.propTypes = {
  availableLocales: PropTypes.arrayOf(PropTypes.string),
  locale: PropTypes.string,
  setLocale: PropTypes.func,
};
