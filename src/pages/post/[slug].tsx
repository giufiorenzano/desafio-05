import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from "@prismicio/client";
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post() {
//   // TODO
}

export const getStaticPaths = async () => {
   const prismic = getPrismicClient();
   const posts = await prismic.query([
    Prismic.predicates.at("document.type", "posts")
  ],);

  console.log(posts)
  return {
    paths: [],
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
};
