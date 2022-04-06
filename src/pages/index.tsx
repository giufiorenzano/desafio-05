import { GetStaticProps } from 'next';
import Prismic from "@prismicio/client";
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({postsPagination}: HomeProps) {
  return (
    <>
      <img src="/Logo.svg" alt="logo" className={styles.img}/>
    </>

  )
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at("document.type", "posts")
  ], {
    fetch: [],
    pageSize: 1
  });

  console.log(postsResponse.results)

};
