import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import { LIGHT_COLORS, DARK_COLORS } from '@constants';
import { ConfigContext } from '@components/ConfigContext';

const GENERIC_DESCRIPTION =
  'Friendly tutorials for developers. Focus on React, CSS, Animation, and more!';

const PROD_URL = 'https://www.frontend-junction.com';

const faviconSrc =
  process.env.NODE_ENV === 'production'
    ? '/assets/favicon.png'
    : '/assets/favicon-dev.png';

function SEO({ description = '', title, seoTitle, ogImage, canonicalPath }) {
  let metaTagTitle = title || 'Josh W Comeau';
  let pageTitle = seoTitle || metaTagTitle;

  const metaDescription = description || GENERIC_DESCRIPTION;

  const ogImageAlt = ogImage
    ? 'Banner for site, showing page title in a playful way'
    : 'Banner for Frontend Junction';

  const actualOgImage = PROD_URL + (ogImage || '/images/og-default.png');

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta charSet='utf-8' />
      <meta name='description' content={metaDescription} />

      {/* TODO: Are these necessary? */}
      <meta httpEquiv='x-ua-compatible' content='ie=edge' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, shrink-to-fit=no'
      />

      <meta property='og:title' content={metaTagTitle} />
      <meta property='og:description' content={metaDescription} />
      <meta property='og:type' content='website' />
      <meta property='og:image' content={actualOgImage} />
      <meta property='og:image:alt' content={ogImageAlt} />
      <meta property='og:image:width' content='1280' />
      <meta property='og:image:height' content='675' />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:creator' content='@sharmadeepak__' />
      <meta name='twitter:title' content={metaTagTitle} />
      <meta name='twitter:description' content={metaDescription} />
      <meta name='twitter:image' content={actualOgImage} />
      <meta name='theme-color' content={themeColor} />

      <link rel='icon' type='image/png' href={`${faviconSrc}?v=4`} />

      {typeof canonicalPath === 'string' && (
        <link rel='canonical' href={PROD_URL + canonicalPath} />
      )}
    </Head>
  );
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
};

export default SEO;
