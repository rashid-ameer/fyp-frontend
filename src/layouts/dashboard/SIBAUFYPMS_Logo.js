import { alpha, styled } from '@mui/material/styles';

export const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 70,
  height: 40,
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadiusSm
}));
