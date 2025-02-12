import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ButtonBase from '@mui/material/ButtonBase';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useTranslation } from 'react-i18next';
import { Img } from 'react-image';
import ManifestListItemError from '../containers/ManifestListItemError';
import ns from '../config/css-ns';

const Root = styled(ListItem, { name: 'ManifestListItem', slot: 'root' })(({ ownerState, theme }) => ({
  '&:hover,&:focus-within': {
    backgroundColor: theme.palette.action.hover,
    borderLeftColor: ownerState?.active ? theme.palette.primary.main : theme.palette.action.hover,
  },
  borderLeft: '4px solid',
  borderLeftColor: ownerState?.active ? theme.palette.primary.main : 'transparent',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

const StyledThumbnail = styled(Img, { name: 'ManifestListItem', slot: 'thumbnail' })(({ theme }) => ({
  maxWidth: '100%',
  objectFit: 'contain',
}));

const StyledLogo = styled(Img, { name: 'ManifestListItem', slot: 'logo' })(({ theme }) => ({
  height: '2.5rem',
  maxWidth: '100%',
  objectFit: 'contain',
  paddingRight: 1,
}));

/** */
const Placeholder = () => (
  <Grid2 container className={ns('manifest-list-item')} spacing={2}>
    <Grid2 xs={3} sm={2}>
      <Skeleton sx={{ bgcolor: 'grey[300]' }} variant="rectangular" height={80} width={120} />
    </Grid2>
    <Grid2 xs={9} sm={6}>
      <Skeleton sx={{ bgcolor: 'grey[300]' }} variant="text" />
    </Grid2>
    <Grid2 xs={8} sm={2}>
      <Skeleton sx={{ bgcolor: 'grey[300]' }} variant="text" />
      <Skeleton sx={{ bgcolor: 'grey[300]' }} variant="text" />
    </Grid2>
    <Grid2 xs={4} sm={2}>
      <Skeleton sx={{ bgcolor: 'grey[300]' }} variant="rectangular" height={60} width={60} />
    </Grid2>
  </Grid2>
);

/**
 * Represents an item in a list of currently-loaded or loading manifests
 * @param {object} props
 * @param {object} [props.manifest = string]
 */
export function ManifestListItem({
  fetchManifest,
  isFetching = false,
  addWindow,
  handleClose = () => { },
  active = false,
  buttonRef = undefined,
  manifestId,
  ready = false,
  title = null,
  thumbnail = null,
  manifestLogo = null,
  size = 0,
  provider = null,
  error = null,
  isCollection = false,
  isMultipart = false,
}) {
  const { t } = useTranslation();
  useEffect(() => {
    if (!ready && !error && !isFetching && provider !== 'file') fetchManifest(manifestId);
  }, [manifestId, provider, fetchManifest, ready, error, isFetching]);

  const ownerState = arguments[0]; // eslint-disable-line prefer-rest-params

  /** */
  const handleOpenButtonClick = () => {
    addWindow({ manifestId });
    handleClose();
  };

  if (error) {
    return (
      <Root
        ownerState={ownerState}
        divider
        selected={active}
        className={active ? 'active' : ''}
        data-manifestid={manifestId}
      >
        <ManifestListItemError manifestId={manifestId} />
      </Root>
    );
  }

  return (
    <Root
      divider
      selected={active}
      className={active ? 'active' : ''}
      data-manifestid={manifestId}
      data-active={active}
    >
      {ready ? (
        <Grid2 container className={ns('manifest-list-item')} spacing={2}>
          <Grid2 xs={12} sm={6}>
            <ButtonBase
              ref={buttonRef}
              className={ns('manifest-list-item-title')}
              style={{ width: '100%' }}
              onClick={handleOpenButtonClick}
            >
              <Grid2
                container
                spacing={2}
                sx={{
                  textAlign: 'left',
                  textTransform: 'initial',
                }}
                component="span"
              >
                <Grid2 xs={4} sm={3} component="span">
                  { thumbnail
                    ? (
                      <StyledThumbnail
                        className={[ns('manifest-list-item-thumb')]}
                        src={[thumbnail]}
                        alt=""
                        height="80"
                        unloader={(
                          <Skeleton
                            variant="rectangular"
                            animation={false}
                            sx={{ bgcolor: 'grey[300]' }}
                            height={80}
                            width={120}
                          />
                        )}
                      />
                    )
                    : <Skeleton sx={{ bgcolor: 'grey[300]' }} variant="rectangular" height={80} width={120} />}
                </Grid2>
                <Grid2 xs={8} sm={9} component="span">
                  { isCollection && (
                    <Typography component="div" variant="overline">
                      { t(isMultipart ? 'multipartCollection' : 'collection') }
                    </Typography>
                  )}
                  <Typography component="span" variant="h6">
                    {title || manifestId}
                  </Typography>
                </Grid2>
              </Grid2>
            </ButtonBase>
          </Grid2>
          <Grid2 xs={8} sm={4}>
            <Typography className={ns('manifest-list-item-provider')}>{provider}</Typography>
            <Typography>{t('numItems', { count: size, number: size })}</Typography>
          </Grid2>

          <Grid2 xs={4} sm={2}>
            { manifestLogo
              && (
              <StyledLogo
                src={[manifestLogo]}
                alt=""
                role="presentation"
                unloader={(
                  <Skeleton
                    variant="rectangular"
                    animation={false}
                    sx={{ bgcolor: 'grey[300]' }}
                    height={60}
                    width={60}
                  />
                )}
              />
              )}
          </Grid2>
        </Grid2>
      ) : (
        <Placeholder />
      )}
    </Root>
  );
}

ManifestListItem.propTypes = {
  active: PropTypes.bool,
  addWindow: PropTypes.func.isRequired,
  buttonRef: PropTypes.elementType,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.oneOf([null]), // for null
  ]),
  fetchManifest: PropTypes.func.isRequired,
  handleClose: PropTypes.func,
  isCollection: PropTypes.bool,
  isFetching: PropTypes.bool,
  isMultipart: PropTypes.bool,
  manifestId: PropTypes.string.isRequired,
  manifestLogo: PropTypes.string,
  provider: PropTypes.string,
  ready: PropTypes.bool,
  size: PropTypes.number,
  thumbnail: PropTypes.string,
  title: PropTypes.string,
};
