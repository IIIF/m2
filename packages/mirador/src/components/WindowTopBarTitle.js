import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import ErrorIcon from '@mui/icons-material/ErrorOutlineSharp';

const StyledTitleTypography = styled(TitleTypography)(({ theme }) => ({
  ...theme.typography.h6,
  flexGrow: 1,
  paddingLeft: theme.spacing(0.5),
}));

const StyledTitle = styled('div')(({ theme }) => ({
  ...theme.typography.h6,
  flexGrow: 1,
  paddingLeft: theme.spacing(0.5),
}));
/** */
function TitleTypography({ children, ...props }) {
  return (
    <Typography variant="h2" noWrap color="inherit" {...props}>
      {children}
    </Typography>
  );
}

TitleTypography.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * WindowTopBarTitle
 */
export function WindowTopBarTitle({
  error = null, hideWindowTitle = false, isFetching = false, manifestTitle = '',
}) {
  let title = null;
  if (isFetching) {
    title = (
      <StyledTitleTypography>
        <Skeleton variant="text" />
      </StyledTitleTypography>
    );
  } else if (error) {
    title = (
      <>
        <ErrorIcon color="error" />
        <StyledTitleTypography color="textSecondary">
          {error}
        </StyledTitleTypography>
      </>
    );
  } else if (hideWindowTitle) {
    title = (<StyledTitle />);
  } else {
    title = (
      <StyledTitleTypography>
        {manifestTitle}
      </StyledTitleTypography>
    );
  }
  return title;
}

WindowTopBarTitle.propTypes = {
  error: PropTypes.string,
  hideWindowTitle: PropTypes.bool,
  isFetching: PropTypes.bool,
  manifestTitle: PropTypes.string,
};
