import Head from "next/head";
import { FC } from "react";

export interface MetaProps {
  url: string;
  title: string;
  imageURL?: string;
  description?: string;
}

export const Meta: FC<MetaProps> = (props) => {
  const {
    title,
    url,
    description = "Create Minimalistic Slide Presentations using Markdown.",
    imageURL = "https://mdslide.vercel.app/banner.png",
  } = props;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />

        {/*   Open Graph / Facebook  */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageURL} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={imageURL} />
      </Head>
    </>
  );
};

export default Meta;
