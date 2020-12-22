import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Head from 'next/head';
import Layout from '../../components/layout';
import markdownToHTML from '../../lib/markdown';

const Post = ({ htmlString, frontmatter }) => {
  return (
    <>
      <Head>
        <title>{frontmatter.title}</title>
        <meta title='description' content={frontmatter.description} />
      </Head>
      <Layout page={frontmatter.title}>
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <section>
            <h1>{frontmatter.title}</h1>
            <small>
              Written by {frontmatter.author} on {frontmatter.date}
            </small>
          </section>
          <section>
            <div dangerouslySetInnerHTML={{ __html: htmlString }} />
          </section>
        </div>
      </Layout>
    </>
  );
};

export default Post;

export const getStaticPaths = async () => {
  const postsDirname = path.join('pages', 'blog', 'posts').toString();
  const files = fs.readdirSync(postsDirname);
  const paths = files.map(filename => ({
    params: {
      slug: filename.replace('.md', ''),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const postsDirname = path.join('pages', 'blog', 'posts').toString();
  const rawMarkdown = fs
    .readFileSync(path.join(postsDirname, slug + '.md'))
    .toString();

  const parsedMarkdown = matter(rawMarkdown);
  const frontmatter = parsedMarkdown.data;
  const htmlString = await markdownToHTML(parsedMarkdown.content);

  frontmatter.date = new Date(frontmatter.date).toISOString().substring(0, 10);
  return {
    props: {
      htmlString,
      frontmatter,
    },
  };
};