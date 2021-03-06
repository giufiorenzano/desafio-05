import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from "@prismicio/client";
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Head from 'next/head';
import Header from '../../components/Header';
import { useEffect, useState } from 'react';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';

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

export default function Post({ post }: PostProps) {
  const router = useRouter()

  if(router.isFallback) {
    return <h1>Carregando...</h1>
  }

  let [timeToRead, setTimeToRead] = useState<number>(0)

  function countWords(str) {
    const arr = str.split(' ');

    return arr.filter(word => word !== '').length;
  }

  useEffect(() => {
    let time = 0;
    post.data.content.forEach((content) => {
      let heading = countWords(content.heading)
      let body = 0
      content.body.forEach((paragraph) => {
        body += countWords(paragraph.text)
      })

      time += heading + body

    })

    let minutes = ((time / 200) % 1 === 0) ? (time / 200): ((time / 200) + 1)
    minutes = Number(minutes.toFixed(0))

    setTimeToRead(minutes)
  })


  return (
    <>
      <Head>
        <title>Post | Spacetraveling </title>
      </Head>

      <Header />
      <main className={styles.container}>
        <img src={post.data.banner.url} alt="poster" />

        <article className={styles.post}>
          <h1>{post.data.title}</h1>

          <span className={commonStyles.postInfo}>
            <FiCalendar />
            <span className={styles.date}>{format((parseISO(post.first_publication_date)), "dd MMM yyyy", {
              locale: ptBR
            })}</span>
            <FiUser />
            <span>{post.data.author}</span>
            <FiClock />
            <span>{`${timeToRead} min`}</span>
          </span>

          {post.data.content.map((content) => {
            return <div key={content.heading}>
              <h3>
                {content.heading}
              </h3>
              <div
                className={`${styles.postContent} ${styles.previewContent}`}
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(content.body) }}
              />
            </div>
          })
          }
        </article>
      </main>

    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at("document.type", "posts")
  ]);

  let paths = posts.results.map((post) => {
    return { params: { slug: post.uid } }
  })

  return {
    paths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID("posts", String(slug), {});


  let content = response.data.content.map((content) => {
    return { heading: content.heading,
      body: [...content.body]
    }
  })

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title:response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: content
    }
  }

  return {
    props: {
      post
    }
  }
};
