import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Cañón Cosmo Store';
const BASE_URL = 'https://canon-cosmo-store.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

type Props = {
    title?: string;
    description?: string;
    image?: string;
    path?: string;
};

const SEO = ({ title, description, image = DEFAULT_IMAGE, path = '' }: Props) => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const fullUrl = `${BASE_URL}${path}`;
    const desc = description ?? 'Tienda especializada en Trading Card Games, Funko Pop, figuras y coleccionables. Pokémon, One Piece, Final Fantasy, Digimon y mucho más.';

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={desc} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph (Facebook, WhatsApp, Discord...) */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={desc} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:image" content={image} />

            {/* Twitter/X */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;
