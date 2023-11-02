import { Link as ScrollLink } from 'react-scroll';
import { useLocation, Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Container, Typography } from '@mui/material';
// components
import Logo from '../../components/Logo';
//
import MainNavbar from './MainNavbar';
import MainFooter from './MainFooter';

import { ThumbImgStyle } from '../dashboard/SIBAUFYPMS_Logo';
// ----------------------------------------------------------------------

export default function MainLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <>
      <MainNavbar />
      <div>
        <Outlet />
      </div>

      {!isHome ? (
        <MainFooter />
      ) : (
        <Box
          sx={{
            py: 5,
            textAlign: 'center',
            position: 'relative',
            bgcolor: 'background.default'
          }}
        >
          <Container maxWidth="lg">
            <ScrollLink to="move_top" spy smooth>
              <ThumbImgStyle alt="SIBAU FYP-MS" src="/static/mock-images/avatars/logo.jpeg" />
            </ScrollLink>

            <Typography variant="caption" component="p">
              © All rights reserved
              <br /> made by &nbsp;
              <Link href="https://minimals.cc/">minimals.cc</Link>
            </Typography>
          </Container>
        </Box>
      )}
    </>
  );
}
