import Link from 'next/link';

interface PostMetadata {
  title: string;
  date: string;
  subtitle: string;
  slug: string;
}

const PostPreview = (props: PostMetadata) => {
  return (
    <div
      className='border border-orange-300 p-4 rounded-md shadow-sm
    bg-white'
    >
      <p className='text-sm text-orange-400'>{props.date}</p>

      <Link href={`/posts/${props.slug}`}>
        <h2 className=' text-white-600 hover:underline mb-4'>{props.title}</h2>
      </Link>
      <p className='text-orange-700'>{props.subtitle}</p>
    </div>
  );
};

export default PostPreview;
