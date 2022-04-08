import next, { GetStaticProps } from 'next';
import Prismic from "@prismicio/client";
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Head from 'next/head';
import Link from "next/link";
import { FiCalendar, FiUser } from "react-icons/fi";
import { useState } from 'react';

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

export default function Home({ postsPagination }: HomeProps) {

  const [ postPagination, setPostPagination ] = useState(postsPagination)


  const handleClick = (nextPage: string) => {
    fetch(nextPage)
      .then(response => response.json())
      .then(data => {
        const posts = data.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: post.first_publication_date,
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author
            }
          }
        })

        const postsPagination = {
          next_page: data.next_page,
          results: [
            ...postPagination.results,
            ...posts
          ]
        }
        setPostPagination(postsPagination)
      }

    )
  }

  return (
    <>
      <Head>
        <title>Home | Spacetraveling </title>
      </Head>

      <main className={styles.container}>
        <img src="/Logo.svg" alt="logo" className={styles.img} />

        {postPagination?.results?.map(post => (
          <div className={styles.post} key={post.uid}>
            <Link href={`/post/${post.uid}`}>
              <a>
                <h1>{post.data.title}</h1>
                <h4>{post.data.subtitle}</h4>

                <span className={styles.postInfo}>
                  <FiCalendar />
                  <span className={styles.date}>{format((parseISO(post.first_publication_date)), "dd MMM yyyy", {
                    locale: ptBR
                  })}</span>
                  <FiUser />
                  <span>{post.data.author}</span>
                </span>
              </a>
            </Link>
          </div>
        ))}

        {postPagination.next_page && <button onClick={() => handleClick(postsPagination.next_page)}>Carregar mais posts</button>}
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at("document.type", "posts")
  ],);

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      }
    }
  })

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts
  }

  return {
    props: {
      postsPagination
    }
  }
};
